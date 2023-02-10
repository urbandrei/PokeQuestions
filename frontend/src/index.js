import React from 'react';
import ReactDom from 'react-dom/client';
import './index.css';

class Game extends React.Component {
        constructor(props) {
		super(props);
		this.state = {
			text: "press reset to start!",
			conditions: "",
		};
	}

	handleClick(t) {
		console.log(this.state.conditions);
		fetch("http://localhost:9000/test/"+t+"/"+this.state.conditions)
        		.then(res => res.text())
        		.then(res => this.setState({ text: res.split('$')[0], conditions: res.split('$')[1] }));
	}

	renderOption(t) {
                return ( <button value={t} onClick={() => this.handleClick(t)}> {t} </button> );
        }

        render() {
                return(
                        <div className="game">
                                <p>{this.state.text}</p>
                                {this.renderOption('yes')}
                                {this.renderOption('no')}
                                {this.renderOption('idk')}
                                {this.renderOption('reset')}
                        </div>
                );
        }
}

const root = ReactDom.createRoot(document.getElementById("root"));
root.render(<Game />);
