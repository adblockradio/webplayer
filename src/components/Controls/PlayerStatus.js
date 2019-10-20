import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import T from "../T";

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

// TODO: Give radio name directly instead of whole Settings
function PlayerStatus(props) {
	const { radio, reducedVolume, settings } = props;

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

	return <StyledText>{text}</StyledText>;
}

PlayerStatus.defaultProps = {
	reducedVolume: false
};

PlayerStatus.propTypes = {
	radio: PropTypes.number.isRequired,
	reducedVolume: PropTypes.bool,
	settings: PropTypes.object.isRequired
};

export default React.memo(PlayerStatus);
