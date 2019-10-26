import React from "react";
import styled from "styled-components";

import breakpoint from "../../helpers/breakpoint";

const StyledSplashscreen = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	background: #98b3ff;

	img {
		width: 190px;

		${breakpoint.min.l`
			width: 380px;
		`}
	}
`;

function Splashscreen() {
	return (
		<StyledSplashscreen>
			<img src="https://static.adblockradio.com/assets/abr_transparent_head.png" alt="Adblock Radio loading" />
		</StyledSplashscreen>
	);
}

export default Splashscreen;
