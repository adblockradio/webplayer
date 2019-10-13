import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import breakpoint from "../../helpers/breakpoint";

const StyledText = styled.span`
	font-size: 18px;

	${breakpoint.min.l`
		font-size: 22px
	`}

	${breakpoint.min.xl`
		font-size: 26px
	`}
`;

const noRadio = { fr: "Choisissez une radio à écouter", en: "Choose a radio to listen to" };
const noSound = { fr: " (volume réduit)", en: " (muted)" };

function PlayerStatus(props) {
	const { radio, reducedVolume, settings } = props;
	const lang = settings.config.uiLang;

	const text = isNaN(radio) ? noRadio[lang] : settings.radios[radio].name + (reducedVolume ? noSound[lang] : "");

	return <StyledText>{text}</StyledText>;
}

PlayerStatus.defaults = {
	reducedVolume: false
};

PlayerStatus.propTypes = {
	radio: PropTypes.number.isRequired,
	reducedVolume: PropTypes.bool,
	settings: PropTypes.object.isRequired
};

export default React.memo(PlayerStatus);
