import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import T from "../T";

const StyledText = styled.span`
	font-size: 26px;
	${props => props.condensed && "font-size: 18px;"}
`;

// TODO: Give radio name directly instead of whole Settings
function PlayerStatus(props) {
	const { condensed, radio, reducedVolume, settings } = props;

	const text = isNaN(radio) ? (
		<T str="player-status.choose" />
	) : (
		<>
			{settings.radios[radio].name}
			{reducedVolume && (
				<>
					{" "}
					(<T str="player-status.muted" />)
				</>
			)}
		</>
	);

	return <StyledText condensed={condensed}>{text}</StyledText>;
}

PlayerStatus.defaults = {
	reducedVolume: false
};

PlayerStatus.propTypes = {
	radio: PropTypes.number.isRequired,
	reducedVolume: PropTypes.bool,
	condensed: PropTypes.bool.isRequired,
	settings: PropTypes.object.isRequired
};

export default React.memo(PlayerStatus);
