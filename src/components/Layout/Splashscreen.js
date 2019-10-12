import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledSplashscreen = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	background: #98b3ff;

	img {
		width: 380px;
		${props => props.condensed && "width: 190px;"}
	}
`;

function Splashscreen(props) {
	const { condensed } = props;

	return (
		<StyledSplashscreen condensed={condensed}>
			<img src="https://static.adblockradio.com/assets/abr_transparent_head.png" alt="Adblock Radio loading" />
		</StyledSplashscreen>
	);
}

Splashscreen.defaults = {
	condensed: false
};

Splashscreen.propTypes = {
	condensed: PropTypes.bool
};

export default Splashscreen;
