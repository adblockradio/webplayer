import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import CountryFlag from "./CountryFlag.js";
import Popup from "./Layout/Popup.js";

import imgOk from "../img/ok_pink.png";

const Title = styled.h3`
	margin-top: 0;
`;
const Desc = styled.p`
	margin-top: 15px;
`;
const SuccessIcon = styled.img`
	width: 96px;
	height: 96px;
	margin: 0 auto 30px;
`;

// TODO: Add these styles to Button component, theme property?
const CustomButton = styled.button`
	display: inline-block;
	width: 100%;
	padding: 6px 12px;
	margin-top: 10px;
	border: 2px solid gray;
	border-radius: 4px;
	text-align: center;
	background: white;
	color: gray;

	&:hover {
		text-decoration: none;
	}

	${props =>
		props.active &&
		`
		border: 2px solid #ef66b0;
		background: #ef66b0;
		color: white;

		&:hover {
			color: white;
		}
	`}
`;

const CountryFlagContainer = styled.div`
	${props => (props.condensed ? "text-align: left; padding-left: 20px;" : "display: inline-block;")}
`;

function PopupFlag(props) {
	const { uiLang, getUnmaintainedRadioList, condensed, trigger, onOpened } = props;

	const thanks = { fr: "Merci du signalement", en: "Thanks for your contribution" }[uiLang];
	const desc = { fr: "Un signalement toutes les 2-3 minutes suffit", en: "A flag every 2-3 minutes is enough" }[uiLang];
	const help = {
		fr: "Pour garantir la qualité du filtre à publicités, Adblock Radio a besoin de votre aide pour:",
		en: "To guarantee the quality of the ad filters, Adblock Radio needs your help to support:"
	}[uiLang];

	const wantMore = { fr: "Je veux en savoir plus", en: "Tell me more about this" }[uiLang];
	const closeTxt = { fr: "Fermer", en: "Close" }[uiLang];

	const renderContent = close => {
		onOpened();
		const unmaintainedRadios = getUnmaintainedRadioList();

		const renderRadioList = () => {
			return unmaintainedRadios.map(radio => (
				<CountryFlagContainer condensed={condensed} key={radio.name}>
					<CountryFlag country={radio.country} selected={false} width={32} height={24} />
					{radio.name}
				</CountryFlagContainer>
			));
		};

		// Simple message, in case no radio need maintener
		if (!unmaintainedRadios.length) {
			setTimeout(close, 4000);
			return (
				<>
					<SuccessIcon src={imgOk} />
					<Title>{thanks}</Title>
					<Desc>{desc}</Desc>
				</>
			);
		}
		// More detailled message, in case we're looking some staff
		else {
			return (
				<>
					<SuccessIcon src={imgOk} />
					<Title>{thanks}</Title>
					<p>{help}</p>

					{renderRadioList()}

					<CustomButton
						as="a"
						href="https://www.adblockradio.com/blog/2019/09/26/about-becoming-a-maintainer/"
						target="_blank"
						rel="noopener noreferrer"
						active
					>
						{wantMore}
					</CustomButton>
					<CustomButton onClick={close}>{closeTxt}</CustomButton>
				</>
			);
		}
	};

	return (
		<Popup condensed={condensed} trigger={trigger}>
			{renderContent}
		</Popup>
	);
}

PopupFlag.defaults = {
	condensed: false
};

PopupFlag.propTypes = {
	condensed: PropTypes.bool,
	uiLang: PropTypes.string.isRequired,
	getUnmaintainedRadioList: PropTypes.func.isRequired,
	trigger: PropTypes.oneOfType([PropTypes.func, PropTypes.element]).isRequired,
	onOpened: PropTypes.func.isRequired
};

export default PopupFlag;
