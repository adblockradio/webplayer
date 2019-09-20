import React, { Component } from "react";
import consts from "../../consts.js";
import PropTypes from "prop-types";
import styled from "styled-components";
import classNames from "classnames";

import play from "../../img/start_1279169.svg";
import stop from "../../img/stop_1279170.svg";

const StatusText = styled.span`
	padding: 10px;
	vertical-align: middle;
	font-size: 18px;
`;

const PlayingRadio = styled(StatusText)`
	font-size: 26px;
	display: flex;
	vertical-align: middle;
	flex-grow: 1;
	align-items: center;

	&.condensed {
		font-size: 18px;
	}
`;

const PlaybackButton = styled.img`
height: 40px;
margin-right: 10px;
`;

class PlayerStatus extends Component {

	render() {
		var lang = this.props.settings.config.uiLang;
		var reducedVolume = this.props.settings.config.filterVolume === consts.VOLUME_MUTED;
		//let radios = this.props.settings.radios;
		let indexRadio = this.props.bsw.getActiveIndex();
		let text;
		if (isNaN(indexRadio)) {
			text = { fr: "Choisissez une radio à écouter", en: "Choose a radio to listen to" }[lang];
		} else {
			text = this.props.settings.radios[indexRadio].name + (reducedVolume ? { fr: " (volume réduit)", en: " (muted)" }[lang] : "");
		}

		return (
			<PlayingRadio className={classNames({ condensed: this.props.condensed })}>
				<PlaybackButton src={isNaN(indexRadio) ? play : stop} alt="Stop" onClick={this.props.playbackAction} />
				{text}
			</PlayingRadio>
		);
	}
}

PlayerStatus.propTypes = {
	settings: PropTypes.object.isRequired,
	bsw: PropTypes.object.isRequired,
	condensed: PropTypes.bool.isRequired,
	playbackAction: PropTypes.func.isRequired
};

export default PlayerStatus;