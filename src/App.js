import React, { Component } from 'react';
import './App.css';
import Ship from "./Ship/Ship";

class App extends Component {
	render() {
		return (
			<div className="App">
				<div>
					<h1>Spaceship</h1>
					<Ship />
				</div>
			</div>
		);
	}
}

export default App;