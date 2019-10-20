import React, { Component } from "react";
import PropTypes from "prop-types";

import RadioElement from "./RadioElement";
import Controls from "./Controls/Controls";

import consts from "../consts.js";

const LOGO_SIZE = 200;
const STATUS_SIZE = 25;
const STATUS_ANGLE = (15 * Math.PI) / 180;
const TRANSITION = "0.2s ease-out";
const CONTROLS_HEIGHT = 60;

const styleDivRadios = {
	position: "relative",
	overflow: "hidden",
	width: "100%",
	height: "100%"
};

class RadiosCarousel extends Component {
	componentDidMount() {
		document.addEventListener("keydown", this.handleNav);

		let self = this;
		this.lastScroll = new Date();
		this.radiolistRef.current.addEventListener("wheel", function(event) {
			let now = new Date(); // avoid too fast scrolling
			if (+now - self.lastScroll < 300) return;
			self.lastScroll = now;
			self.props.bsw.manualTuning(event.deltaY > 0 ? 1 : -1);
		});

		let radios = this.props.settings.radios;
		for (let i = 0; i < radios.length; i++) {
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
	}

	render() {
		let radios = this.props.settings.radios;
		let self = this;
		let indexRadio = this.props.bsw.getActiveIndex();
		let noFilter = this.props.settings.config.filterType === consts.FILTER_OFF;
		let isPodium = this.props.settings.config.actionType === consts.ACTION_PODIUM;
		let styleLogo = [],
			styleOverlay = [],
			styleName = [],
			styleStatus = [],
			positionData = [];

		let translate = [];
		for (let i = 0; i < radios.length; i++) {
			translate.push(i);
		}

		for (let i = 0; i < radios.length; i++) {
			let delta = translate[i] - indexRadio;
			let scalef, angleRotate, logoL, logoT, logoS, zIndex, shadow, fontS, statusR, statusS, controlShift;
			if (isNaN(delta)) delta = i - (radios.length - 1) / 2;

			let acceptableContent = 1;

			let targetVolume = this.props.bsw.getFilteredVolume(this.props.settings.radios[translate[i]].getStatus());
			if (targetVolume === consts.VOLUME_MUTED && !noFilter) {
				acceptableContent = 0;
			}

			let scalef_base = 1 - 0.5 * this.props.condensed;

			if (isNaN(indexRadio)) {
				logoT = 5 + ((i + 1.0) / (radios.length + 1)) * 95;
				scalef = scalef_base;
				logoL = 50;
				zIndex = i * 100;
			} else if (this.props.settings.config.actionType === consts.ACTION_PODIUM) {
				//angle = 0;
				logoT = 5 + ((i + 1.0) / (radios.length + 1)) * 95;
				logoL = 50;
				scalef = scalef_base * (1 + 0.5 * (translate[i] === indexRadio));
				zIndex = (radios.length - Math.abs(delta)) * 100;
			} else {
				logoT = 5 + ((i + 1.0 + 0.5 * (i === indexRadio) + 1 * (i > indexRadio)) / (radios.length + 2)) * 95;
				logoL = 50 + Math.abs(i - indexRadio) * 3;
				scalef = scalef_base * (1 + 0.5 * (translate[i] === indexRadio));
				zIndex = (radios.length - Math.abs(delta)) * 100;
			}

			shadow = noFilter ? 0 : 0.8 * (1 - acceptableContent);
			fontS = Math.round(18 + 6 * acceptableContent) * scalef;

			angleRotate = 0;
			statusR = LOGO_SIZE * scalef; // radius for position of status dots
			logoS = LOGO_SIZE * scalef; // diameter of radio logo + shadow
			statusS = STATUS_SIZE * (this.props.condensed ? 1 : scalef); // diameter of status dots
			controlShift = Math.round((logoT * CONTROLS_HEIGHT) / 100);

			let styleLogoBase = {
				left: "" + logoL + "%",
				top: "calc(" + logoT + "% - " + controlShift + "px)",
				borderRadius: "50%",
				transition: TRANSITION,
				position: "absolute"
			};

			styleLogo.push(
				Object.assign({}, styleLogoBase, {
					width: "" + logoS + "px",
					height: "" + logoS + "px",
					marginLeft: "" + -logoS / 2 + "px",
					marginTop: "" + -logoS / 2 + "px",
					background: "white",
					zIndex: "" + zIndex,
					transform: "rotate(" + (-angleRotate * 180) / Math.PI + "deg)"
				})
			);

			styleOverlay.push(
				Object.assign({}, styleLogoBase, {
					width: "" + logoS + "px",
					height: "" + logoS + "px",
					marginLeft: "" + -logoS / 2 + "px",
					marginTop: "" + -logoS / 2 + "px",
					background: "rgba(187,187,187," + shadow + ")",
					zIndex: "" + (zIndex + 1),
					cursor:
						acceptableContent || this.props.settings.config.actionType === consts.ACTION_MUTE
							? "pointer"
							: "not-allowed"
				})
			);

			styleName.push({
				left: "calc(" + logoL + "% + " + (logoS * (0.5 + 1 / 8) + 30) * Math.cos(-angleRotate) + "px)",
				top: "calc(" + logoT + "% + " + ((logoS * (0.5 + 1 / 8) + 30) * Math.sin(-angleRotate) - controlShift) + "px)",
				fontSize: "" + fontS + "px",
				fontWeight: "bold",
				color: "rgba(0,0,0," + (1 - shadow) + ")",
				marginTop: "-0.5em",
				zIndex: "" + zIndex,
				transformOrigin: "left",
				transform: "rotate(" + (-angleRotate * 180) / Math.PI + "deg)",
				transition: TRANSITION,
				cursor: acceptableContent ? "pointer" : "not-allowed"
			});

			styleStatus.push(function(status, condensed) {
				let statusAngle = 0,
					statusBgColor = consts.getStatusColor(status);
				switch (status) {
					case consts.STATUS_AD:
						statusAngle = -STATUS_ANGLE * (1 + 0.5 * condensed);
						break;
					case consts.STATUS_MUSIC:
						statusAngle = +STATUS_ANGLE * (1 + 0.5 * condensed);
						break;
					default:
				}
				return {
					left: "calc(" + logoL + "% - " + (statusR / 2) * 1.1 * Math.cos(statusAngle + angleRotate) + "px)",
					top:
						"calc(" +
						logoT +
						"% + " +
						((statusR / 2) * 1.1 * Math.sin(statusAngle + angleRotate) - controlShift) +
						"px)",
					width: statusS + "px",
					height: statusS + "px",
					transform: "rotate(" + (-angleRotate * 180) / Math.PI + "deg)",
					zIndex: "" + (zIndex + 1),
					marginLeft: -statusS / 2 + "px",
					marginTop: -statusS / 2 + "px",
					transition: TRANSITION,
					background: radios[i].getStatus() === status ? statusBgColor : "#bbbbbb"
				};
			});

			positionData.push({
				left: "calc(" + logoL + "% + " + logoS * 0.3 + "px)",
				top: "calc(" + logoT + "% - " + (logoS * 0.5 - controlShift) + "px)",
				position: "absolute",
				zIndex: "" + (zIndex + 1),
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
						<RadioElement
							radio={radio}
							key={"radio" + i}
							style={{
								logo: styleLogo[ti],
								overlay: styleOverlay[ti],
								name: styleName[ti],
								status: styleStatus[ti]
							}}
							position={{
								number: i + 1,
								style: positionData[ti]
							}}
							condensed={self.props.condensed}
							onClick={() => self.handleRadioClick(ti)}
						/>
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
