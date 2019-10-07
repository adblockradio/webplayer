import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import consts from "../../consts.js";
import Choice from "./Choice.jsx";
import { Title, SlideText, ChoiceList } from "./styles.js";

import roundabout from "../../img/action/roundabout.png";
import podium from "../../img/action/podium.png";
import mute from "../../img/action/mute.png";

class ChooseAction extends Component {

	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		console.log("choose action " + event.target.value);
		this.props.bsw.changeActionType(+event.target.value);
	}

	render() {
		var lang = this.props.settings.config.uiLang;
		let content = {fr:"les pubs", en: "ads"}[lang] + (this.props.settings.config.filterType === consts.FILTER_MUSIC ? {fr:" et le blabla",en:" and chit-chat"}[lang] : "");
		let disabled = this.props.settings.config.filterType === consts.FILTER_OFF;

		return (
			<div>
				<Title className={classNames({condensed: this.props.condensed})}>{{fr:"Je remplace le contenu indésirable", en:"I replace unwanted content"}[lang]}</Title>

				<SlideText className={classNames({condensed: this.props.condensed})}>{{fr:"Adblock Radio peut remplacer en direct " + content + " par d'autres contenus.", en:"Adblock can replace " + content + " by other media"}[lang]}</SlideText>
				{disabled &&
					<SlideText className={classNames({condensed: this.props.condensed})}>{{fr:"Vous n'avez pas activé le filtre à l'étape précédente, cette fonctionnalité n'est donc pas disponible. Vous pouvez passer à l'étape suivante.", en: "You have disabled the filter at the previous step, so this feature is not available. You can proceed to the next step."}[lang]}</SlideText>
				}

				<ChoiceList className={classNames({condensed: this.props.condensed})}>
					<Choice title={{fr:"Mode silence", en:"Muting mode"}[lang]} description={{fr:"Je baisse le son pendant " + content + ", tout simplement.", en:"I simply turn the volume down during " + content}[lang]} icons={[mute]} multiIcons={false} disabled={disabled}
						current={this.props.settings.config.actionType} value={consts.ACTION_MUTE} onClick={this.props.bsw.changeActionType} condensed={this.props.condensed} />

					<Choice title={{fr:"Mode zappe et revient", en:"Hop & return mode"}[lang]} description={{fr:"Pendant " + content + ", je zappe sur une autre radio, puis reviens à la reprise.", en:"During " + content + ", I listen to another radio, then channel-hop at resumption."}[lang]} icons={[podium]} multiIcons={false} disabled={disabled}
						current={this.props.settings.config.actionType} value={consts.ACTION_PODIUM} onClick={this.props.bsw.changeActionType}  condensed={this.props.condensed} />

					<Choice title={{fr:"Mode zappe et reste",en:"Hop & stay mode"}[lang]} description={{fr:"J'évite " + content + " en zappant sur une autre station.",en:"I avoid " + content + " by channel-hopping to another station"}[lang]} icons={[roundabout]} multiIcons={false} disabled={disabled}
						current={this.props.settings.config.actionType} value={consts.ACTION_ROUNDABOUT} onClick={this.props.bsw.changeActionType}  condensed={this.props.condensed} />
				</ChoiceList>
			</div>
		);
	}
}

ChooseAction.propTypes = {
	settings: PropTypes.object.isRequired,
	bsw: PropTypes.object.isRequired,
	condensed: PropTypes.bool.isRequired,
};

export default ChooseAction;