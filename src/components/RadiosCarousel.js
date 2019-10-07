import React, { Component } from "react";
import PropTypes from "prop-types";
import consts from "../consts.js";
import classNames from "classnames";
import styled from "styled-components";
//import StatusChart from "./StatusChart.js";
import Controls from "./Controls/Controls";
import RoundNumber from "./RoundNumber";
import music from "../img/type/1music.png";
import speech from "../img/type/2speech.png";
import ads from "../img/type/3ads.png";

const LOGO_SIZE = 200; //120; // in pixels
const STATUS_SIZE = 25; // in pixels
const STATUS_ANGLE = 15*Math.PI/180; // in radians
const TRANSITION = "0.2s ease-out";
const CONTROLS_HEIGHT = 60; // pixels

const Shadow = styled.div`
	opacity: 0.5;
	width: 100%;
	height: 100%;
	border-radius: 50%;
	box-shadow: 0px 0px 15px 0px rgb(0, 0, 0);
	&.playing {
		opacity: 0.2;
		box-shadow: 0px 0px 60px 20px rgb(0, 0, 0);
		animation-name: shadow;
		animation-duration: 3s;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
	}
	&.condensed {
		box-shadow: unset;
		border: 1px solid black;
	}

	@keyframes shadow {
		0%  { opacity: 0.6; }
		50%  { opacity: 0.3; }
		100% { opacity: 0.6; }
	}
`;

const RadioName = styled.span`
	position: absolute;
	color: #644194;
	margin-right: 1em;
`;

const RadioStatus = styled.div`
	position: absolute;
	transition: ${TRANSITION};
	/*border: 1px solid black;*/
	border-radius: 50%;
`;

const RadioStatusLogo = styled.img`
	/*max-height:100%;
	max-width:100%;*/
	filter: invert(100%);
	width: 80%;
	margin: 10%;
	height: 80%;
`;


class RadioElement extends Component {

	constructor(props) {
		super(props);
		this.onClick = this.props.onClick.bind(this);
	}

	render() {
		let radio = this.props.radio;
		return (
			<div>
				<img src={radio.logo || "https://static.adblockradio.com/assets/default_radio_logo.png"} alt={radio.name} style={this.props.style.logo} />
				<div style={this.props.style.overlay} onClick={this.onClick}>
					<Shadow className={classNames({playing: radio.playing, condensed: this.props.condensed})}></Shadow>
				</div>
				{!this.props.condensed &&
					<RadioName style={this.props.style.name} onClick={this.onClick}>{radio.name}</RadioName>
				}
				{this.props.position &&
					<RoundNumber active={false} disabled={false} done={true} number={this.props.position.number} style={this.props.position.style} />
				}
				<RadioStatus style={this.props.style.status(consts.STATUS_AD, this.props.condensed)}><RadioStatusLogo src={ads} /></RadioStatus>
				<RadioStatus style={this.props.style.status(consts.STATUS_SPEECH, this.props.condensed)}><RadioStatusLogo src={speech} /></RadioStatus>
				<RadioStatus style={this.props.style.status(consts.STATUS_MUSIC, this.props.condensed)}><RadioStatusLogo src={music} /></RadioStatus>
			</div>
		);
	}
}

RadioElement.propTypes = {
	radio: PropTypes.object.isRequired,
	onClick: PropTypes.func.isRequired,
	condensed: PropTypes.bool.isRequired,
	position: PropTypes.object,
	style: PropTypes.object.isRequired,
};

const styleDivRadios = {
	position: "relative",
	overflow: "hidden",
	width: "100%",
	height: "100%"
};

class RadiosCarousel extends Component {
	// key press
	componentDidMount() {
		document.addEventListener("keydown", this.handleNav);

		let self = this;
		this.lastScroll = new Date();
		this.radiolistRef.current.addEventListener("wheel", function(event) {
			let now = new Date(); // avoid too fast scrolling
			if (+now-self.lastScroll < 300) return;
			self.lastScroll = now;
			self.props.bsw.manualTuning(event.deltaY > 0 ? 1 : -1);
		});

		let radios = this.props.settings.radios;
		for (let i=0; i<radios.length; i++) {
			this.props.bsw.getRadio(radios[i].country, radios[i].name, result => {
				result.logo = result.favicon;
				this.props.settings.addRadio(result);
			});
		}
	}

	componentWillUnmount() {
		document.removeEventListener("keydown", this.handleNav);
	}

	constructor(props) {
		super(props);
		this.handleRadioClick = this.handleRadioClick.bind(this);
		this.handleNav = this.handleNav.bind(this);
		this.radiolistRef = React.createRef();
	}

	handleRadioClick(i) {
		let targetVolume = this.props.bsw.getFilteredVolume(this.props.settings.radios[i].getStatus());
		if (targetVolume === consts.VOLUME_NORMAL || this.props.settings.config.actionType === consts.ACTION_MUTE) {
			this.props.bsw.togglePlay(this.props.settings.radios[i].name);
		}
	}

	handleNav(evt) {
		let delta = 0;
		if (evt.key === "ArrowDown") {
			delta = 1;
		} else if (evt.key === "ArrowUp") {
			delta = -1;
		}
		this.props.bsw.manualTuning(delta);
		//console.log(evt.key);
	}

	render() {
		let radios = this.props.settings.radios;
		let self = this;
		let indexRadio = this.props.bsw.getActiveIndex();
		let noFilter = this.props.settings.config.filterType === consts.FILTER_OFF;
		let isPodium = this.props.settings.config.actionType === consts.ACTION_PODIUM;
		let styleLogo = [], styleOverlay = [], styleName = [], styleStatus = [], positionData = [];
		//let styleChart = [], stylePlaying = [];

		let translate = [];
		/*if (this.props.settings.config.actionType === consts.ACTION_ROUNDABOUT && !isNaN(indexRadio)) {
			for (let i=indexRadio; i<radios.length; i++) { translate.push(i); }
			for (let i=0; i<indexRadio; i++) { translate.push(i); }
		} else {*/
		for (let i=0; i<radios.length; i++) { translate.push(i); }
		//}

		for (let i=0; i<radios.length; i++) {
			//let i = translate[j]
			let delta = translate[i] - indexRadio;
			let scalef, angleRotate, logoL, logoT, logoS, zIndex, shadow, fontS, statusR, statusS, controlShift;
			if (isNaN(delta)) delta = i-(radios.length-1)/2;

			let acceptableContent = 1; // = 0.5;

			let targetVolume = this.props.bsw.getFilteredVolume(this.props.settings.radios[translate[i]].getStatus());
			//if (targetVolume === consts.VOLUME_NORMAL || noFilter) {
			//	acceptableContent = 1;
			//} else
			if (targetVolume === consts.VOLUME_MUTED && !noFilter) {
				acceptableContent = 0;
			}

			let scalef_base = 1-0.5*this.props.condensed;

			if (isNaN(indexRadio)) {

				//angle = 0;
				logoT = 5+(i+1.0)/(radios.length+1)*95; //50+(ARC_RADIUS+20*acceptableContent)*Math.sin(angle);
				scalef = scalef_base; //0.3+0.2*acceptableContent;
				logoL = 50; //45-10*acceptableContent; //(50+ARC_RADIUS) - (ARC_RADIUS+20*acceptableContent)*Math.cos(angle);
				zIndex = i*100;

			} else if (this.props.settings.config.actionType === consts.ACTION_PODIUM) {
				//angle = 0;
				logoT = 5+(i+1.0)/(radios.length+1)*95; //50+(ARC_RADIUS+20*acceptableContent)*Math.sin(angle);
				logoL = 50;
				scalef = scalef_base*(1+0.5*(translate[i]===indexRadio));
				zIndex = (radios.length-Math.abs(delta))*100;

			} else {
				logoT = 5+(i+1.0+0.5*(i===indexRadio) + 1*(i>indexRadio))/(radios.length+2)*95;
				logoL = 50 + Math.abs(i-indexRadio) * 3;
				scalef = scalef_base*(1+0.5*(translate[i]===indexRadio)); //0.3+0.2*acceptableContent;
				zIndex = (radios.length-Math.abs(delta))*100;

			}
			//angle = 0; //delta*(35*scalef)/180*Math.PI*50/ARC_RADIUS;//0;
			shadow = noFilter ? 0 : 0.8*(1-acceptableContent);
			fontS = Math.round(18+6*acceptableContent)*scalef;



			angleRotate = 0;//angle / 2;
			statusR = LOGO_SIZE * scalef; // radius for position of status dots
			logoS = LOGO_SIZE * scalef; // * (0.8+0.2*acceptableContent); // diameter of radio logo + shadow
			statusS = STATUS_SIZE*(this.props.condensed ? 1 : scalef); // diameter of status dots
			controlShift = Math.round(logoT*CONTROLS_HEIGHT/100);
			//console.log("i=" + i + " scalef=" + scalef + " angle=" + angle*180/Math.PI + " logoL=" + logoL + " logoT=" + logoT + " logoS=" + logoS);

			let styleLogoBase = {
				left: "" + (logoL) + "%",
				top: "calc(" + (logoT) + "% - " + controlShift + "px)",
				borderRadius: "50%",
				transition: TRANSITION,
				position: "absolute"
			};

			styleLogo.push(Object.assign({}, styleLogoBase, {
				width: "" + (logoS) + "px",
				height: "" + (logoS) + "px",
				marginLeft: "" + (-logoS/2) + "px",
				marginTop: "" + (-logoS/2) + "px",
				background: "white",
				zIndex: "" + zIndex,
				transform: "rotate(" + (-angleRotate*180/Math.PI) + "deg)"
			}));

			styleOverlay.push(Object.assign({}, styleLogoBase, {
				width: "" + (logoS) + "px",
				height: "" + (logoS) + "px",
				marginLeft: "" + (-logoS/2) + "px",
				marginTop: "" + (-logoS/2) + "px",
				background: "rgba(187,187,187," + shadow + ")",//consts.getStatusColor(radios[i].getStatus()) + Math.round(255*shadow).toString(16),
				/*border: "2px solid black",*/
				zIndex: "" + (zIndex+1),
				cursor: (acceptableContent || this.props.settings.config.actionType === consts.ACTION_MUTE) ? "pointer" : "not-allowed",
			}));

			styleName.push({
				left: "calc(" + (logoL) + "% + " + ((logoS*(0.5+1/8)+30)*Math.cos(-angleRotate)) + "px)",
				top: "calc(" + logoT + "% + " + ((logoS*(0.5+1/8)+30)*Math.sin(-angleRotate)-controlShift) + "px)",
				fontSize: "" + fontS + "px",
				fontWeight: "bold",
				color: "rgba(0,0,0," + (1-shadow) + ")",
				marginTop: "-0.5em",
				zIndex: "" + zIndex,
				transformOrigin: "left",
				transform: "rotate(" + (-angleRotate*180/Math.PI) + "deg)",
				transition: TRANSITION,
				cursor: acceptableContent ? "pointer" : "not-allowed"
			});

			styleStatus.push(function(status, condensed) {
				let statusAngle = 0, statusBgColor = consts.getStatusColor(status);
				switch (status) {
					case consts.STATUS_AD: statusAngle = -STATUS_ANGLE*(1+0.5*condensed); break;
					case consts.STATUS_MUSIC: statusAngle = +STATUS_ANGLE*(1+0.5*condensed); break;
					default:
				}
				return {
					left: "calc(" + (logoL) + "% - " + (statusR/2*1.1*Math.cos(statusAngle+angleRotate)) + "px)",
					top: "calc(" + (logoT) + "% + " + (statusR/2*1.1*Math.sin(statusAngle+angleRotate)-controlShift) + "px)",
					width: statusS + "px",
					height: statusS + "px",
					transform: "rotate(" + (-angleRotate*180/Math.PI) + "deg)",
					zIndex: "" + (zIndex+1),
					marginLeft: (-statusS/2) + "px",
					marginTop: (-statusS/2) + "px",
					transition: TRANSITION,
					background: radios[i].getStatus() === status ? statusBgColor : "#bbbbbb"
				};
			});

			//if (delta === 0) {
			/*styleChart.push({
				left: "calc(" + (logoL) + "% - " + ((statusR/2*1.1*Math.cos(STATUS_ANGLE)+STATUS_SIZE/2*scalef)*Math.cos(angleRotate)) + "px)",
				top: "calc(" + (logoT) + "% + " + ((statusR/2*1.1*Math.cos(STATUS_ANGLE)+STATUS_SIZE/2*scalef)*Math.sin(angleRotate)-controlShift) + "px)",
				width: CHART_WIDTH*scalef + "px",
				height: CHART_HEIGHT*scalef + "px",
				marginLeft: -CHART_WIDTH*scalef + "px",
				marginTop: -CHART_HEIGHT/2*scalef + "px",
				position: "absolute",
				transformOrigin: "right",
				transform: "rotate(" + (-angleRotate*180/Math.PI) + "deg)",
				transition: TRANSITION
			});*/

			positionData.push({
				left: "calc(" + (logoL) + "% + " + (logoS*0.3) + "px)",
				top: "calc(" + logoT + "% - " + (logoS*0.5-controlShift) + "px)",
				position: "absolute",
				zIndex: "" + (zIndex+1),
				fontSize: "" + fontS + "px",
				fontWeight: "bold",
				opacity: isPodium ? "1" : "0",
				transition: TRANSITION
			});
		}

		return (
			<div ref={this.radiolistRef} onKeyPress={this.handleNav} onScroll={this.handleScroll} style={styleDivRadios}>
				<Controls settings={this.props.settings} bsw={this.props.bsw} condensed={this.props.condensed} />
				{radios.map(function(radio, i) {
					let ti = translate.indexOf(i);
					return (
						<RadioElement radio={radio} key={"radio" + i}
							style={{
								logo: styleLogo[ti],
								overlay: styleOverlay[ti],
								name: styleName[ti],
								status: styleStatus[ti],
								/*chart: styleChart[ti],*/
								/*playing: stylePlaying[ti]*/
							}}
							position={{
								number: i+1,
								style: positionData[ti]
							}}
							condensed={self.props.condensed}
							onClick={() => self.handleRadioClick(ti)}/>
					);
				})}
			</div>
		);
	}
}

RadiosCarousel.propTypes = {
	bsw: PropTypes.object.isRequired,
	settings: PropTypes.object.isRequired,
	condensed: PropTypes.bool.isRequired
};

export default RadiosCarousel;
