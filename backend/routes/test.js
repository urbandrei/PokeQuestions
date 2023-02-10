var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');

let db = new sqlite3.Database('./db', (err) => {
	if (err) { return console.error(err.message); }
	console.log('Connected to the in-memory SQlite database.');
});

router.get('/yes/:cond',   function(req, res, next) { answer(req.params.cond + '=1',  res); });
router.get('/no/:cond',    function(req, res, next) { answer(req.params.cond + '=0',  res); });
router.get('/idk/:cond',   function(req, res, next) { answer(req.params.cond + '>-1', res); });
router.get('/reset/:cond', function(req, res, next) { answer(' WHERE 1=1', res);            });
router.get('/reset',       function(req, res, next) { answer(' WHERE 1=1', res);            });
router.get('/yes/',        function(req, res, next) { res.send('press reset to start!$');   });
router.get('/no/',         function(req, res, next) { res.send('press reset to start!$');   });
router.get('/idk/',        function(req, res, next) { res.send('press reset to start!$');   });

function answer(conditions, res) {
	var ids = [];
        var smol = 1;
        var question;

        db.all("SELECT name FROM pokemon"+conditions+";", [], (err, rows) => {
		if (err) { throw err; }
                
		if      (rows.length == 0) { res.send("answers don't fit an existing Pokemon!$"); }
                else if (rows.length == 1) { res.send(rows[0].Name+'$');                          }
		else {
                        db.all("SELECT id FROM questions;", [], (err, rows) => {
				if (err) { throw err; }
                                
				rows.forEach(row => { if (!conditions.includes(row.ID)) { ids.push(row.ID); } });
				//Forces the end if there are no questions left
				if(ids.length == 0) { ids.push('name');}
                                findQ(ids, smol, question, res, conditions);
});	}	});	}

function findQ(ids, smol, question, res, conditions) {
	i = ids.pop();
	db.all("SELECT abs(avg(" + i + ") - 0.5) AS total FROM pokemon" + conditions + ";", [], (err, rows) => {
		if (err) { throw err; }
		
		if(rows[0].total < smol) {
			question = i;
			smol = rows[0].total;
		}
		if (ids.length > 0) { findQ(ids,smol,question,res,conditions); }
		else if (smol == 0.5) {
			db.all("SELECT name from pokemon"+conditions+";", [], (err, rows) => {
				if (err) { throw err; }
				
				var pokeList = '';
				rows.forEach(row => { pokeList = pokeList + ', ' + row.Name; });
				pokeList = 'possible pokemon are ' + pokeList.slice(2) + '!';
				res.send(pokeList+'$');
			});
		} else {
			conditions = conditions + " AND " + question;
			db.all("SELECT text from questions where ID = \"" + question + "\";", [], (err, rows) => {
				if (err) { throw err; }
				
				res.send(rows[0].Text+'$'+ conditions);
});	}	});	}

module.exports = router;
