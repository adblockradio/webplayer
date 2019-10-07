import React, { Component } from "react";
import PropTypes from "prop-types";
//import classNames from "classnames";
//import styled from "styled-components";
import consts from "../consts.js";

const BEZIER_DT = 1000; // in ms
const BG_DT = 30000; // in ms
//const WAVE_AMPLITUDE = 0.1; // in height units
//const WAVE_PERIOD = 10; // in seconds
//const WAVE_DECAY = 3; // in seconds

let cvStyle = {
	position: "absolute",
	//transition: "5s linear",
	top: 0,
	left: 0
};

const spx = function(status, height) { // from status to position in Y, in pixels
	let bin = null;
	switch (status) {
		case consts.STATUS_AD: bin = 0; break;
		case consts.STATUS_SPEECH: bin = 1; break;
		case consts.STATUS_MUSIC: bin = 2; break;
		default: return NaN;
	}
	return height*(1.0/6 + bin/3.0);
};

/*const spxw = function(status, height, refDate, date) {
	return spx(status, height)+height*WAVE_AMPLITUDE*Math.cos(2*Math.PI*(+date/1000 % WAVE_PERIOD)/WAVE_PERIOD)*Math.exp(-(+refDate-date)/1000/WAVE_DECAY);
};*/

const tpx = function(width, refDate, date) { // from date to position in X, in pixels
	let pxps = 1.0 * width / consts.STATUS_HISTORY_LENGTH; // pixels per second
	return width + (date-refDate)*pxps/1000;
};

class StatusChart extends Component {

	constructor(props) {
		super(props);
		this.updateCanvas = this.updateCanvas.bind(this);
		this.bgCanvasRef = React.createRef();
		this.canvasRef = React.createRef();
	}

	drawBg() {
		//console.log(require('util').inspect(bgcanvas, { depth: null }));
		const ctx = this.bgCanvasRef.current.getContext("2d");
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.beginPath();
		ctx.setLineDash([1, 4]);/*dashes are 5px and spaces are 3px*/
		ctx.stokeStyle = "rgba(0,0,0,0.2)";
		ctx.moveTo(0, spx(consts.STATUS_AD, ctx.canvas.height));
		ctx.lineTo(ctx.canvas.width, spx(consts.STATUS_AD, ctx.canvas.height));
		ctx.moveTo(0, spx(consts.STATUS_SPEECH, ctx.canvas.height));
		ctx.lineTo(ctx.canvas.width, spx(consts.STATUS_SPEECH, ctx.canvas.height));
		ctx.moveTo(0, spx(consts.STATUS_MUSIC, ctx.canvas.height));
		ctx.lineTo(ctx.canvas.width, spx(consts.STATUS_MUSIC, ctx.canvas.height));

		let now = new Date();
		let d = new Date(Math.floor(+now/BG_DT)*BG_DT);
		//console.log(d.toISOString(), now.toISOString(), (+now-d)/1000);

		while (+d/1000 >= +now/1000 - consts.STATUS_HISTORY_LENGTH) {
			//console.log(d.toISOString(), now.toISOString(), (+now-d)/1000);
			ctx.moveTo(tpx(ctx.canvas.width, now, d), spx(consts.STATUS_AD, ctx.canvas.height));
			ctx.lineTo(tpx(ctx.canvas.width, now, d), spx(consts.STATUS_MUSIC, ctx.canvas.height));
			d = new Date(+d-BG_DT);
		}

		ctx.stroke();
	}

	componentDidMount() {
		//this.drawBg();
		//this.updateHandle = window.requestAnimationFrame(this.updateCanvas);
		this.updateHandle = setInterval(this.updateCanvas, 200);
		//this.updateCanvas();
	}

	componentWillUnmount() {
		clearInterval(this.updateHandle);
		//window.cancelAnimationFrame(this.updateHandle);
	}

	componentDidUpdate() {
		//this.drawBg();
		this.updateCanvas();
	}

	updateCanvas() {
		this.drawBg();
		//console.log(require('util').inspect(canvas, { depth: null }));

		const ctx = this.canvasRef.current.getContext("2d");
		let height = ctx.canvas.height; //parseFloat(this.props.style.height);
		let width = ctx.canvas.width; //parseFloat(this.props.style.width);
		ctx.clearRect(0, 0, width, height);
		let s = this.props.status;
		if (s.length > 0) {
			let refDate = new Date(); //s[s.length-1].date;
			let gradient = ctx.createLinearGradient(0,spx(consts.STATUS_AD, ctx.canvas.height),0,spx(consts.STATUS_MUSIC, ctx.canvas.height));
			gradient.addColorStop(0, consts.COLOR_ADS);
			gradient.addColorStop(0.5, consts.COLOR_SPEECH);
			gradient.addColorStop(1, consts.COLOR_MUSIC);
			ctx.strokeStyle = gradient;
			ctx.lineWidth = 5;
			ctx.beginPath();
			ctx.moveTo(tpx(width, refDate, refDate), spx(s[s.length-1].status, height));//, refDate, refDate));
			ctx.lineTo(tpx(width, refDate, new Date(+s[s.length-1].date)), spx(s[s.length-1].status, height)); //, refDate, new Date(+s[s.length-1].date)));

			for (let i=s.length-2; i>=0; i--) {
				if (+s[i+1].date - s[i].date > 10000) { // no data for a while. do not draw.
					ctx.moveTo(tpx(width, refDate, s[i].date), spx(s[i].status, height));
				} else {
					ctx.bezierCurveTo(tpx(width, refDate, new Date(+s[i+1].date-BEZIER_DT)), spx(s[i+1].status, height), //refDate, new Date(+s[i+1].date-BEZIER_DT)), // control point 1
						tpx(width, refDate, new Date(+s[i].date+BEZIER_DT)), spx(s[i].status, height), //refDate, new Date(+s[i].date+BEZIER_DT)), // control point 2
						tpx(width, refDate, s[i].date), spx(s[i].status, height)); //, refDate, s[i].date)); // destination
				}
			}
			ctx.stroke();
		}
		//setTimeout(() => { this.updateHandle = window.requestAnimationFrame(this.updateCanvas); }, 100);
	}

	render() {
		/*let style = Object.assign(this.props.style, {
			marginLeft: parseFloat(this.props.style.marginLeft)*2 + "px"
		});*/

		return (
			<div style={this.props.style}>
				<canvas ref={this.bgCanvasRef} width={parseFloat(this.props.style.width)} height={parseFloat(this.props.style.height)} style={Object.assign(cvStyle, {zIndex: 1})} />
				<canvas ref={this.canvasRef} width={parseFloat(this.props.style.width)} height={parseFloat(this.props.style.height)} style={Object.assign(cvStyle, {zIndex: 2})} />
			</div>
		);
	}
}
//width={CHART_WIDTH} height={CHART_HEIGHT} className="driftCanvas"


StatusChart.propTypes = {
	status: PropTypes.array.isRequired,
	style: PropTypes.object.isRequired,
};

export default StatusChart;
