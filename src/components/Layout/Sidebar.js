import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Button from "../Controls/Button";

import abrlogo from "../../img/abr_transparent.png";

const StyledSidebar = styled.div`
	height: 100vh;
	width: 350px;

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

	${props => props.condensed && "width: 60px;"}
	${props => props.condensed && props.opened && "width: 100%;"}
`;

// eslint-disable-next-line react/prop-types
const Logo = ({ className }) => (
	<a href="https://www.adblockradio.com/" className={className}>
		<img src={abrlogo} alt="Adblock Radio" />
	</a>
);

const StyledToggle = styled(Button)`
	width: 40px;
	height: 39px;
	margin: 10px 0 20px;
	padding: 0;
	border-radius: 10px;
	font-size: 20px;
	align-items: center;
	justify-content: center;
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
	const { condensed, children } = props;

	const [opened, setOpened] = useState(false);

	const toggleOpened = () => setOpened(!opened);

	return (
		<StyledSidebar condensed={condensed} opened={opened}>
			{condensed && (
				<StyledToggle onClick={toggleOpened} condensed glyphicon={opened ? iconMenuOpened : iconMenuClosed} />
			)}
			{!condensed && <TopLogo />}
			{children(opened)}
			{condensed && opened && <BottomLogo />}
		</StyledSidebar>
	);
}

Sidebar.defaults = {
	children: () => {},
	condensed: false
};

Sidebar.propTypes = {
	children: PropTypes.func,
	condensed: PropTypes.bool
};

export default Sidebar;
