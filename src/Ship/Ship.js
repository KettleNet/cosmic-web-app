import React, { Component } from 'react';
import './Ship.css';
import Modal from 'react-modal';

class ShipCell extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showDetails: false,
			humidity: null,
			temperature: null,
			smoke: null,
			pressure: null,
			voltage: null,
			ready: false
		};

		this.handleOpenDetails  = this.handleOpenDetails.bind(this);
		this.handleCloseDetails = this.handleCloseDetails.bind(this);
		this.afterOpenDetails   = this.afterOpenDetails.bind(this);
		//this.setClose   = this.setClose;
	}

	handleOpenDetails() {
		this.setState({showDetails: true});
	}

	handleCloseDetails() {
		console.log(this.state);
		this.setState({showDetails: false});
		this.setClose();
		console.log(this.state);
	}

	setClose() {
		this.setState({showDetails: false});
	}

	afterOpenDetails() {

	}

	componentDidMount() {
		this.setState({
			ready: true
		});
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.data.length > 1) {
			let newState = nextProps.data[ nextProps.data.length - 1 ];

			if (parseInt(newState[ 'device_name' ]) === this.props.num) {
				let data                        = {};
				data[ newState[ 'data_type' ] ] = newState[ 'data' ];
				this.setState(data);
			}
		}
	}

	isRed(type, value) {
		const percentage = (a, b) => Math.abs((a - b) / ((a + b) / 2)) * 100;
		const normals    = {
			"temperature": function (v) {
				let min = 21,
				    max = 25;
				return v < min || v > max;


			},
			"humidity": function (v) {
				let min = 40,
				    max = 60;
				return v < min || v > max;


			},
			"smoke": function (v) {
				// 0 - 2800
				let max = 2800;
				return v > max;
			},
			"voltage": function (v) {
				let min = 3,
				    max = 3.6;
				return v < min || v > max;
			},
			"pressure": function (v) {
				let min = 980,
				    max = 1020;
				return v < min || v > max;
			}
		};

		return normals[ type ](value);
	}

	render() {
		const getStatusClassName = (status) => {
			switch (status) {
				case false:
					return 'ship__cell--ok';
				case true:
					return 'ship__cell--error';
			}
		};

		let reds = {
			'humidity': this.isRed("humidity", this.state.humidity),
			'temperature': this.isRed("temperature", this.state.temperature),
			'voltage': this.isRed("voltage", this.state.voltage),
			'pressure': this.isRed("pressure", this.state.pressure),
			'smoke': this.isRed("smoke", this.state.smoke)
		};

		let status = false;

		for (let r in reds) {
			status = status || reds[ r ];
		}

		let text = [];
		if (this.state.humidity !== null)
			text.push({key: 'humidity', text: "Влажность: " + this.state.humidity});
		if (this.state.temperature !== null)
			text.push({key: 'temperature', text: "Температура: " + this.state.temperature});
		if (this.state.voltage !== null)
			text.push({key: 'voltage', text: "Напряжение: " + this.state.voltage});
		if (this.state.pressure !== null)
			text.push({key: 'pressure', text: "Давление: " + this.state.pressure});
		if (this.state.smoke !== null)
			text.push({key: 'smoke', text: "Показатель задымления: " + this.state.smoke});

		let statusClass = getStatusClassName(status);
		if (this.state.humidity === null
			&& this.state.temperature === null
			&& this.state.voltage === null
			&& this.state.pressure === null
			&& this.state.smoke === null) {
			statusClass = 'ship__cell--no-data';
		}


		return (
			<div onClick={this.handleOpenDetails} className={"ship__cell " + statusClass}>
				«Отсек {this.props.num}»
				<div className={"ship__cell__data"}>
					{text.map((e) => (<div className={reds[ e.key ] === true ? ' red' : ''}>{e.text}</div>))}
				</div>
			</div>
		);
	}
}

class Ship extends Component {
	constructor(props) {
		super(props);
		this.state = {id: 0, name: '', showDetails: false, data: []};
	}

	componentDidMount() {

		this.connection = new WebSocket(window.wsServer + "/echo");

		this.connection.onmessage = evt => {
			if (typeof this.state.data === "object") {
				this.setState({
					data: Object.values(this.state.data)
				});
			}

			this.setState({
				data: [ ...this.state.data.slice(0, 49), JSON.parse(evt.data) ]
			});
			console.log(evt.data);
		};
	}

	render() {
		let i = 1;
		return (
			<table className="ship">
				<tbody>
				<tr>
					<td className="ship__cell_cascade"></td>
					<td className="ship__cell_cascade"></td>
					<td className="ship__cell_cascade"><ShipCell num={i++} data={this.state.data}/></td>
					<td className="ship__cell_cascade"></td>
					<td className="ship__cell_cascade"></td>
				</tr>
				<tr>
					<td className="ship__cell_cascade"><ShipCell num={i++} data={this.state.data}/></td>
					<td className="ship__cell_cascade"><ShipCell num={i++} data={this.state.data}/></td>
					<td className="ship__cell_cascade"></td>
					<td className="ship__cell_cascade"><ShipCell num={i++} data={this.state.data}/></td>
					<td className="ship__cell_cascade"><ShipCell num={i++} data={this.state.data}/></td>
				</tr>
				<tr>
					<td className="ship__cell_cascade"></td>
					<td className="ship__cell_cascade"></td>
					<td className="ship__cell_cascade"><ShipCell num={i++} data={this.state.data}/></td>
					<td className="ship__cell_cascade"></td>
					<td className="ship__cell_cascade"></td>
				</tr>
				</tbody>
			</table>
		);
	}
}

export default Ship;