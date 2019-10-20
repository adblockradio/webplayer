import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import classNames from "classnames";

import RoundNumber from "./RoundNumber";

import consts from "../consts.js";

import music from "../img/type/1music.png";
import speech from "../img/type/2speech.png";
import ads from "../img/type/3ads.png";

const TRANSITION = "0.2s ease-out";

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
		0% {
			opacity: 0.6;
		}
		50% {
			opacity: 0.3;
		}
		100% {
			opacity: 0.6;
		}
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
	border-radius: 50%;
`;

const RadioStatusLogo = styled.img`
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
				<img
					src={radio.logo || "https://static.adblockradio.com/assets/default_radio_logo.png"}
					alt={radio.name}
					style={this.props.style.logo}
				/>
				<div style={this.props.style.overlay} onClick={this.onClick}>
					<Shadow className={classNames({ playing: radio.playing, condensed: this.props.condensed })}></Shadow>
				</div>
				{!this.props.condensed && (
					<RadioName style={this.props.style.name} onClick={this.onClick}>
						{radio.name}
					</RadioName>
				)}
				{this.props.position && (
					<RoundNumber
						active={false}
						disabled={false}
						done={true}
						number={this.props.position.number}
						style={this.props.position.style}
					/>
				)}
				<RadioStatus style={this.props.style.status(consts.STATUS_AD, this.props.condensed)}>
					<RadioStatusLogo src={ads} />
				</RadioStatus>
				<RadioStatus style={this.props.style.status(consts.STATUS_SPEECH, this.props.condensed)}>
					<RadioStatusLogo src={speech} />
				</RadioStatus>
				<RadioStatus style={this.props.style.status(consts.STATUS_MUSIC, this.props.condensed)}>
					<RadioStatusLogo src={music} />
				</RadioStatus>
			</div>
		);
	}
}

RadioElement.propTypes = {
	radio: PropTypes.object.isRequired,
	onClick: PropTypes.func.isRequired,
	condensed: PropTypes.bool.isRequired,
	position: PropTypes.object,
	style: PropTypes.object.isRequired
};

export default RadioElement;
