import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import consts from "../../consts.js";
import Choice from "./Choice.jsx";
import { Title, SlideText, ChoiceList } from "./styles.js";

import music from "../../img/type/1music.png";
import speech from "../../img/type/2speech.png";
import ads from "../../img/type/3ads.png";


class ChooseFilter extends Component {

	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		console.log("choose filter " + event.target.value);
		this.props.bsw.changeFilterType(+event.target.value);
	}

	render() {
		var lang = this.props.settings.config.uiLang;
		return (
			<div>
				<Title className={classNames({condensed: this.props.condensed})}>{{fr: "Je choisis ce que je veux entendre", en: "I choose what I want to hear"}[lang]}</Title>
				<SlideText className={classNames({condensed: this.props.condensed})}>{{fr: "Adblock Radio distingue automatiquement musique, talk et pubs à la radio.", en:"Adblock Radio recognizes music, talk and ads on the radio."}[lang]}</SlideText>

				<ChoiceList className={classNames({condensed: this.props.condensed})}>
					<Choice title={{fr:"Mode musical",en:"Musical mode"}[lang]} description={{fr: "Que de la musique. Pas de pubs, pas de blabla.", en:"Music only. No ads, no chit-chat"}[lang]} icons={[music]} multiIcons={true}
						current={this.props.settings.config.filterType} value={consts.FILTER_MUSIC} onClick={this.props.bsw.changeFilterType} condensed={this.props.condensed} />

					<Choice title={{fr:"Mode sans pubs",en:"Ad-free mode"}[lang]} description={{fr: "De la musique et des émissions, mais pas de pubs.", en:"Music and talk, but no ads."}[lang]} icons={[music, speech]} multiIcons={true}
						current={this.props.settings.config.filterType} value={consts.FILTER_SPEECH} onClick={this.props.bsw.changeFilterType} condensed={this.props.condensed} />

					<Choice title={{fr:"Pas de filtre", en:"No filter"}[lang]} description={{fr:"La radio telle qu'elle est normalement, avec les pubs.", en:"Radio as it is traditionally broadcast, including ads"}[lang]} icons={[music, speech, ads]} multiIcons={true}
						current={this.props.settings.config.filterType} value={consts.FILTER_OFF} onClick={this.props.bsw.changeFilterType} condensed={this.props.condensed} />
				</ChoiceList>
			</div>
		);
	}
}

ChooseFilter.propTypes = {
	settings: PropTypes.object.isRequired,
	bsw: PropTypes.object.isRequired,
	condensed: PropTypes.bool.isRequired
};

export default ChooseFilter;