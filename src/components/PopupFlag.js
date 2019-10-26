import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import CountryFlag from "./CountryFlag.js";
import Popup from "./Layout/Popup.js";
import T from "./T";

import breakpoint from "../helpers/breakpoint";

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
	text-align: left;
	padding-left: 20px;

	${breakpoint.min.l`
		display: inline-block;
		padding-left: 0;
	`}
`;

function PopupFlag(props) {
	const { getUnmaintainedRadioList, trigger, onOpened } = props;

	const renderContent = close => {
		onOpened();
		const unmaintainedRadios = getUnmaintainedRadioList();

		const renderRadioList = () => {
			return unmaintainedRadios.map(radio => (
				<CountryFlagContainer key={radio.name}>
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
					<Title>
						<T str="popup.flag.thanks" />
					</Title>
					<Desc>
						<T str="popup.flag.desc" />
					</Desc>
				</>
			);
		}
		// More detailled message, in case we're looking some staff
		else {
			return (
				<>
					<SuccessIcon src={imgOk} />
					<Title>
						<T str="popup.flag.thanks" />
					</Title>
					<p>
						<T str="popup.flag.help" />
					</p>

					{renderRadioList()}

					<CustomButton
						as="a"
						href="https://www.adblockradio.com/blog/2019/09/26/about-becoming-a-maintainer/"
						target="_blank"
						rel="noopener noreferrer"
						active
					>
						<T str="popup.flag.more" />
					</CustomButton>
					<CustomButton onClick={close}>
						<T str="popup.flag.close" />
					</CustomButton>
				</>
			);
		}
	};

	return <Popup trigger={trigger}>{renderContent}</Popup>;
}

PopupFlag.propTypes = {
	getUnmaintainedRadioList: PropTypes.func.isRequired,
	trigger: PropTypes.oneOfType([PropTypes.func, PropTypes.element]).isRequired,
	onOpened: PropTypes.func.isRequired
};

export default PopupFlag;
