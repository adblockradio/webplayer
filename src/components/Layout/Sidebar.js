import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Button from "../Controls/Button";

import { useBreakpoint } from "../../helpers/hooks";
import breakpoint from "../../helpers/breakpoint";

const StyledSidebar = styled.div`
	height: 100vh;
	width: 60px;

	overflow: auto;

	background: linear-gradient(to bottom, #a4d7fe 0%, #98b3ff 100%);
	z-index: 1000;
	text-align: center;
	transition: 0.2s ease-in-out;

	display: flex;
	flex-direction: column;
	align-items: center;

	/* allow to push player outside the screen on mobile with menu opened */
	flex-shrink: 0;

	${props => props.opened && "width: 100%;"}

	${breakpoint.min.l`
		width: 350px;
	`}
`;

// eslint-disable-next-line react/prop-types
const Logo = ({ className }) => (
	<a href="https://www.adblockradio.com/" className={className}>
		<img src="https://static.adblockradio.com/assets/abr_transparent.png" alt="Adblock Radio" />
	</a>
);

const StyledToggle = styled(Button)`
	width: 40px;
	height: 39px;
	margin: 10px 0 20px;
	padding: 0;
	border-radius: 15px;
	font-size: 20px;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
`;

const TopLogo = styled(Logo)`
	display: inline-block;
	margin: 20px 0 40px;

	& img {
		width: 100%;
	}
`;

const BottomLogo = styled(Logo)`
	& img {
		width: 80%;
	}
`;

const iconMenuOpened = "chevron-left";
const iconMenuClosed = "menu-hamburger";

function Sidebar(props) {
	const { children } = props;

	const [opened, setOpened] = useState(false);
	const isDesktop = useBreakpoint("l");

	const toggleOpened = () => setOpened(!opened);

	return (
		<StyledSidebar opened={opened}>
			{!isDesktop && <StyledToggle onClick={toggleOpened} glyphicon={opened ? iconMenuOpened : iconMenuClosed} />}
			{isDesktop && <TopLogo />}
			{children(opened)}
			{!isDesktop && opened && <BottomLogo />}
		</StyledSidebar>
	);
}

Sidebar.defaults = {
	children: () => {}
};

Sidebar.propTypes = {
	children: PropTypes.func
};

export default Sidebar;
