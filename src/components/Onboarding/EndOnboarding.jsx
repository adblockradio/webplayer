import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import styled from "styled-components";

import { Title } from "./styles.js";
import consts from "../../consts.js";

import ok from "../../img/ok_pink.png";
import flag from "../../img/flag2.svg";

const EndOnboardingContainer = styled.div`
	/*padding-top: 5em;*/
`;

const EndDescription = styled.p`
	font-size: 20px;
	&.condensed {
		font-size: 18px;
	}
`;

const EndIcon = styled.img`
	display: block;
	margin: 16px auto;
	width: 96px;
`;

const FlagIcon = styled.img`
	vertical-align: middle;
	width: 25px;
	height: 25px;
	margin: 10px 0 10px 10px;
`;

class EndOnboarding extends Component {
	render() {
		var lang = this.props.settings.config.uiLang;
		return (
			<EndOnboardingContainer>
				<Title className={classNames({condensed: this.props.condensed})}>
					<EndIcon src={ok} />
					{{fr:"Félicitations, vous êtes prêt à écouter la radio", en:"Congratulations, you are ready to listen to the radio"}[lang]}
				</Title>
				{this.props.settings.config.filterType !== consts.FILTER_OFF ?
					<EndDescription className={classNames({condensed: this.props.condensed})}><b>{{fr:"Astuce\xa0: ",en:"Tip: "}[lang]}</b>{{fr:"parfois le filtre se trompe. Améliorez-le en cliquant sur le bouton de signalement",en:"the filter is sometimes wrong. Improve it by clicking the flag button"}[lang]}<FlagIcon src={flag}></FlagIcon></EndDescription>
					:
					<EndDescription className={classNames({condensed: this.props.condensed})}>{{fr:"Nous vous souhaitons une très belle écoute\xa0!",en:"We wish you a very good time!"}[lang]}</EndDescription>
				}
			</EndOnboardingContainer>
		);
	}
}
EndOnboarding.propTypes = {
	condensed: PropTypes.bool.isRequired,
	settings: PropTypes.object.isRequired
};

export default EndOnboarding;