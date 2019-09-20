import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import styled from "styled-components";

import ChoiceElement from "./Controls/ChoiceElement.jsx";
import { Feedback } from "./Feedback.jsx";
import Flag from "./Flag.jsx";

import roundabout from "../img/action/roundabout.png";
import podium from "../img/action/podium.png";
import mute from "../img/action/mute.png";
import music from "../img/type/1music.png";
import speech from "../img/type/2speech.png";
import ads from "../img/type/3ads.png";
import wand from "../img/wand.png";
import ratings from "../img/ratings100.png";

import flagIcon from "../img/flag2.svg";
import donate from "../img/donate_2226736.svg";

import consts from "../consts.js";

const TRANSITION_BTN = "0.2s ease-in-out";


const FilterTable = styled.table`
	margin: auto;
`;

const MenuContainer = styled.div`
	overflow-y: auto;
	height: 100vh;
	width: 350px; /*20vw;*/
	/*min-width: 250px;*/
	/*left: 0px;*/
	padding: 10px 0px;
	/*position: fixed;*/
	overflow: auto;
	background: linear-gradient(to bottom, #a4d7fe 0%, #98b3ff 100%);
	z-index: 1000;
	text-align: center;
	transition: ${TRANSITION_BTN};
	flex-basis: auto;
	flex-shrink: 0;
	flex-grow: 0;

	&.condensed {
		width: 60px;
		/*min-width: unset;*/
	}

	&.expanded {
		width: 100%;
	}
`;

const HeaderLogo = styled.img`
	width: 100%;
	margin: 15px auto 15px auto;
	&.condensed {
		width: 80%;
		margin: unset;
	}
`;

const OnboardingTable = styled(FilterTable)`
	margin: 1em auto 1em auto;
	&.buttonGroup {
		margin: 2em auto 2em auto;
	}
	&.condensed {
		margin: 1em auto 1em auto;
	}
	/*&.condensed.expanded {
		margin: 1em auto 1em auto;
	}*/
`;

const ChoiceTitle = styled.td`
	/*margin: 20px 5px 5px 5px;*/
	color: white;
	font-weight: bold;
	font-size: 23px;
`;

const Hint = styled.div`
	color: white;
	font-size: 16px;
	margin: 5px;
`;
/*const ChoiceTitleIcon = styled.img`
	margin: 0px 5px 10px 5px;
	width: 30px;
	filter: invert(100%);
`;*/

const BurgerStyle = {
	background: "white",
	color: "black",
	fontSize: "20px",
	padding: "0.5em",
	borderRadius: "0.5em",
	cursor: "pointer",
	marginBottom: "10px"
};

class FilteringChoice extends Component {

	constructor(props) {
		super(props);
		this.state = { expanded: false, feedback: false, flag: false };
		this.handleShowOnboarding = this.handleShowOnboarding.bind(this);
		this.toggleExpanded = this.toggleExpanded.bind(this);
		this.handleShowFeedback = this.handleShowFeedback.bind(this);
		this.handleCloseFeedback = this.handleCloseFeedback.bind(this);
		this.handleShowFlag = this.handleShowFlag.bind(this);
		this.handleCloseFlag = this.handleCloseFlag.bind(this);
	}

	handleShowOnboarding() {
		this.props.showOnboarding();
	}

	handleShowFeedback() {
		this.setState({ feedback: true });
	}

	handleCloseFeedback() {
		this.setState({ feedback: false });
	}

	handleShowFlag() {
		this.props.bsw.sendFlag();
		this.setState({ flag: true });
	}

	handleCloseFlag() {
		this.setState({ flag: false });
	}

	toggleExpanded() {
		this.setState({expanded: !this.state.expanded});
	}

	render() {

		let logo = (
			<a href="https://www.adblockradio.com/">
				<HeaderLogo src="https://static.adblockradio.com/assets/abr_transparent.png" className={classNames({condensed: this.props.condensed})} alt={"Adblock Radio"} />
			</a>
		);

		let menuHeader;
		if (this.props.condensed && this.state.expanded) {
			menuHeader = <div><span className="glyphicon glyphicon-chevron-left" style={BurgerStyle} onClick={this.toggleExpanded}></span></div>;
		} else if (this.props.condensed && !this.state.expanded) {
			menuHeader = <div><span className="glyphicon glyphicon-menu-hamburger" style={BurgerStyle} onClick={this.toggleExpanded}></span></div>;
		} else {
			menuHeader = logo;
		}

		const UICondensed = this.props.condensed && !this.state.expanded;
		const config = this.props.settings.config;
		const lang = config.uiLang;

		return (
			<MenuContainer className={classNames({condensed: this.props.condensed, expanded: this.props.condensed && this.state.expanded})}>

				{(this.props.hideButtons !== true) ?
					<div style={{overflowY: "auto"}}>
						{menuHeader}

						<OnboardingTable className={classNames({condensed: this.props.condensed, buttonGroup: true})}>
							<tbody>
								<tr>
									{!UICondensed &&
										<ChoiceTitle>{{fr:"Je veux écouter\xa0:",en:"I want to listen to:"}[lang]}</ChoiceTitle>
									}
								</tr>
								<ChoiceElement logo={music} caption={{fr:"Musique",en:"Music only"}[lang]} setParam={() => this.props.bsw.changeFilterType(consts.FILTER_MUSIC)}
									active={config.filterType === consts.FILTER_MUSIC}
									condensed={this.props.condensed}
									expanded={this.state.expanded}
									first={true} />
								<ChoiceElement logo={speech} caption={{fr:"Pas de pub",en:"Music & talk"}[lang]} setParam={() => this.props.bsw.changeFilterType(consts.FILTER_SPEECH)}
									active={config.filterType === consts.FILTER_SPEECH}
									condensed={this.props.condensed}
									expanded={this.state.expanded} />
								<ChoiceElement logo={ads} caption={{fr:"Sans filtre",en:"Anything"}[lang]} setParam={() => this.props.bsw.changeFilterType(consts.FILTER_OFF)}
									active={config.filterType === consts.FILTER_OFF}
									condensed={this.props.condensed}
									expanded={this.state.expanded}
									last={true} />
							</tbody>
						</OnboardingTable>


						<OnboardingTable className={classNames({condensed: this.props.condensed, buttonGroup: true})}>
							<tbody>
								<tr>
									{!UICondensed &&
										<ChoiceTitle>{{fr:"En cas de pub…",en:"On ad detection…"}[lang]}</ChoiceTitle>
									}
								</tr>
								<ChoiceElement logo={mute} caption={{fr:"Silence",en:"Mute"}[lang]} setParam={() => this.props.bsw.changeActionType(consts.ACTION_MUTE)}
									active={config.actionType === consts.ACTION_MUTE}
									condensed={this.props.condensed}
									first={true}
									expanded={this.state.expanded}
									disabled={config.filterType === consts.FILTER_OFF} />
								<ChoiceElement logo={podium} caption={{fr:"Zappe & revient",en:"Hop & return"}[lang]} setParam={() => this.props.bsw.changeActionType(consts.ACTION_PODIUM)}
									active={config.actionType === consts.ACTION_PODIUM}
									condensed={this.props.condensed}
									expanded={this.state.expanded}
									disabled={config.filterType === consts.FILTER_OFF} />
								<ChoiceElement logo={roundabout} caption={{fr:"Zappe & reste",en:"Hop & stay"}[lang]} setParam={() => this.props.bsw.changeActionType(consts.ACTION_ROUNDABOUT)}
									active={config.actionType === consts.ACTION_ROUNDABOUT}
									condensed={this.props.condensed}
									last={true}
									expanded={this.state.expanded}
									disabled={config.filterType === consts.FILTER_OFF} />

							</tbody>
						</OnboardingTable>

						<OnboardingTable className={classNames({condensed: this.props.condensed, buttonGroup: false})}>
							<tbody>
								<ChoiceElement logo={wand} caption={{fr:"Réglages",en:"Settings"}[lang]} setParam={this.handleShowOnboarding}
									active={false}
									condensed={this.props.condensed}
									expanded={this.state.expanded}
									first={true} last={true} />
							</tbody>
						</OnboardingTable>

						<OnboardingTable className={classNames({condensed: this.props.condensed, buttonGroup: false})}>
							<tbody>
								<ChoiceElement logo={flagIcon} caption={{fr:"Bug de filtrage\xa0?",en:"Filtering error?"}[lang]} setParam={this.handleShowFlag}
									active={false}
									condensed={this.props.condensed}
									expanded={this.state.expanded}
									first={true} last={true} />
							</tbody>
						</OnboardingTable>

						<OnboardingTable className={classNames({condensed: this.props.condensed, buttonGroup: false})}>
							<tbody>
								<ChoiceElement logo={ratings} caption={{fr:"Vos suggestions",en:"Give feedback"}[lang]} setParam={this.handleShowFeedback}
									active={false}
									condensed={this.props.condensed}
									expanded={this.state.expanded}
									first={true} last={true} />
							</tbody>
						</OnboardingTable>

						<OnboardingTable className={classNames({condensed: this.props.condensed, buttonGroup: false})}>
							<tbody>
								<ChoiceElement logo={donate} caption={{fr:"Faites un don",en:"Donate"}[lang]}
									active={false}
									condensed={this.props.condensed}
									expanded={this.state.expanded}
									first={true} last={true}
									externalLink={"https://" + lang + ".liberapay.com/asto/donate"} />
							</tbody>
						</OnboardingTable>

						{this.props.condensed && this.state.expanded &&
							<div>
								<Hint>
									{{fr: "Astuce: sur Chrome mobile, ce site est une application installable. Allez dans le menu et cliquez sur \"Ajouter à l'écran d'accueil\".", en:"Tip: on Chrome mobile, this website is an installable application. Open the menu and click on \"Add to home screen\"."}[lang]}
								</Hint>
								{logo}
							</div>

						}
					</div>
					:
					logo
				}

				{this.state.feedback &&
					<Feedback send={this.props.bsw.sendFeedback}
						close={this.handleCloseFeedback}
						settings={this.props.settings}
						condensed={this.props.condensed} />
				}
				{this.state.flag &&
					<Flag settings={this.props.settings}
						close={this.handleCloseFlag}
						condensed={this.props.condensed} />
				}
			</MenuContainer>
		);
	}
}
/*
<label className="btn btn-default modeButton" onClick={this.handleShowOnboarding}>
	<span className="glyphicon glyphicon-flash" aria-hidden="true"></span>Accueil
</label>

<FilterAction state={this.props.config.actionType} changeActionType={this.props.bsw.changeActionType} condensed={this.props.condensed}
	expanded={this.state.expanded} disabled={this.props.config.filterType === consts.FILTER_OFF}/>

	<FilterContent state={this.props.config.filterType} changeFilterType={this.props.bsw.changeFilterType} condensed={this.props.condensed}
		expanded={this.state.expanded} />
*/

/*<td>
	<ChoiceTitleIcon src={headphones} />
</td>
<td>
	<ChoiceTitleIcon src={shield} />
</td>*/

FilteringChoice.propTypes = {
	settings: PropTypes.object.isRequired,
	bsw: PropTypes.object.isRequired,
	showOnboarding: PropTypes.func.isRequired,
	hideButtons: PropTypes.bool,
	condensed: PropTypes.bool.isRequired
};

export default FilteringChoice;
