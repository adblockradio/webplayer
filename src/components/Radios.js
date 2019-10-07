import React, { Component } from "react";
import PropTypes from "prop-types";
import consts from "../consts.js";
import classNames from "classnames";
import styled from "styled-components";
import StatusChart from "./StatusChart.js";

import play from "../img/status/play.png";
import playing from "../img/status/playing.gif";
import pause from "../img/status/pause.png";
import music from "../img/type/1music.png";
import speech from "../img/type/2speech.png";
import ads from "../img/type/3ads.png";
import unknown from "../img/type/unknown.png";
import unavailable from "../img/type/unavailable.png";

const DivRadio = styled.div`
	margin: 5px auto;
`;

class RadioElement extends Component {
	constructor(props) {
		super(props);
		this.play = this.play.bind(this);
		this.handleMoveUp = this.handleMoveUp.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
		this.handleMoveDown = this.handleMoveDown.bind(this);
	}

	play() {
		this.props.bsw.togglePlay(this.props.radio.name);
		this.forceUpdate();
	}

	handleRemove() {
		this.props.settings.removeRadio(this.props.radio.name);
		this.forceUpdate();
	}

	handleMoveUp() {
		let self = this;
		this.props.bsw.moveRadio(this.props.radio.name, "up", function() {
			self.forceUpdate();
		});
	}

	handleMoveDown() {
		let self = this;
		this.props.bsw.moveRadio(this.props.radio.name, "down", function() {
			self.forceUpdate();
		});
	}

	render() {
		let radioInfo = this.props.radio;
		//console.log("rendering radio " + radioInfo.name);
		let playerConfig = this.props.settings.config;
		let playPauseLogo = play;
		if (radioInfo.playing && radioInfo.hovered) {
			playPauseLogo = pause;
		} else if (radioInfo.playing) {
			playPauseLogo = playing;
		}
		let radioLogo = radioInfo.logo || play;
		let shadeColor = "";
		if (playerConfig.filterType !== consts.FILTER_OFF) {
			let filteredVolume = this.props.bsw.getFilteredVolume(radioInfo.getStatus());
			if (filteredVolume === consts.VOLUME_NORMAL || filteredVolume === consts.VOLUME_UNKNOWN) {
				shadeColor = " statusShadeGreen";
			} else {
				shadeColor = " statusShadeRed";
			}
		}
		let radioStatus;
		switch (radioInfo.getStatus()) {
			case consts.STATUS_MUSIC: radioStatus = music; break;
			case consts.STATUS_SPEECH: radioStatus = speech; break;
			case consts.STATUS_AD: radioStatus = ads; break;
			case consts.STATUS_STREAM_BROKEN: radioStatus = unavailable; break;
			default: radioStatus = unknown;
		}
		return (
			<DivRadio className={"radioInfo vmid" + classNames({" playing": radioInfo.playing })} draggable="true">
				<img src={playPauseLogo} className="playingGif" alt="Playing" />
				<img className="radioLogo" src={radioLogo} alt="Radio logo" />
				<div className="radioName">{radioInfo.name}</div>
				<span className="statusContainer">
					<span className={"statusShade" + shadeColor}>
						<img className="statusLogo" src={radioStatus} alt="Radio status" />
					</span>
				</span>
				<div className="playlistCommands">
					<span className="playlistCommand glyphicon glyphicon-chevron-up" aria-hidden="true" onClick={this.handleMoveUp} ></span><br />
					<span className="playlistCommand glyphicon glyphicon-remove" aria-hidden="true" onClick={this.handleRemove} ></span><br />
					<span className="playlistCommand glyphicon glyphicon-chevron-down" aria-hidden="true" onClick={this.handleMoveDown} ></span>
				</div>

				<div className="radioInfoOverlay" onClick={this.play}></div>
			</DivRadio>
		);
	}
}

RadioElement.propTypes = {
	settings: PropTypes.object.isRequired,
	bsw: PropTypes.object.isRequired,
	radio: PropTypes.object.isRequired
};

const DivRadios = styled.div`
	margin: auto;
`;

class Radios extends Component {
	render() {
		let props = this.props;
		return (
			<DivRadios>
				{props.settings.radios.map(function(radio, i){
					return <RadioElement radio={radio} settings={props.settings} bsw={props.bsw} key={"radio" + i} />;
				})}
				<StatusChart status={this.props.settings.radios[0].status} />
			</DivRadios>
		);
	}
}

Radios.propTypes = {
	bsw: PropTypes.object.isRequired,
	settings: PropTypes.object.isRequired
};

export default Radios;
