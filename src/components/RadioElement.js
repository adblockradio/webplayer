import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import RoundNumber from "./RoundNumber";

import { useBreakpoint } from "../helpers/hooks";
import breakpoint from "../helpers/breakpoint";

import consts from "../consts.js";

import music from "../img/type/1music.png";
import speech from "../img/type/2speech.png";
import ads from "../img/type/3ads.png";

const Shadow = styled.div`
	opacity: 0.5;
	width: 100%;
	height: 100%;
	border-radius: 50%;
	border: 1px solid black;

	${props =>
		props.playing && breakpoint.min.l`
  	opacity: 0.2;
		box-shadow: 0px 0px 60px 20px rgb(0, 0, 0);
		animation-name: shadow;
		animation-duration: 3s;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
	`}

	${breakpoint.min.l`
    box-shadow: 0px 0px 15px 0px rgb(0, 0, 0);
    border: none;
  `}

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
	transition: 0.2s ease-out;
	border-radius: 50%;
`;

const RadioStatusLogo = styled.img`
	width: 80%;
	height: 80%;
	margin: 10%;
	filter: invert(100%);
`;

function RadioElement(props) {
	const { radio, style, onClick, position } = props;

	const isDesktop = useBreakpoint("l");

	return (
		<>
			<img
				src={radio.logo || "https://static.adblockradio.com/assets/default_radio_logo.png"}
				alt={radio.name}
				style={style.logo}
			/>
			<div style={style.overlay} onClick={onClick}>
				<Shadow playing={radio.playing} />
			</div>

			{isDesktop && (
				<RadioName style={style.name} onClick={onClick}>
					{radio.name}
				</RadioName>
			)}

			{position && (
				<RoundNumber active={false} disabled={false} done={true} number={position.number} style={position.style} />
			)}

			<RadioStatus style={style.status(consts.STATUS_AD, !isDesktop)}>
				<RadioStatusLogo src={ads} />
			</RadioStatus>
			<RadioStatus style={style.status(consts.STATUS_SPEECH, !isDesktop)}>
				<RadioStatusLogo src={speech} />
			</RadioStatus>
			<RadioStatus style={style.status(consts.STATUS_MUSIC, !isDesktop)}>
				<RadioStatusLogo src={music} />
			</RadioStatus>
		</>
	);
}

RadioElement.defaultProps = {
	position: PropTypes.object,
};

RadioElement.propTypes = {
	radio: PropTypes.object.isRequired,
	onClick: PropTypes.func.isRequired,
	position: PropTypes.object,
	style: PropTypes.object.isRequired
};

export default RadioElement;
