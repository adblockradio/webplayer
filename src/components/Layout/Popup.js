import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Overlay = styled.div`
	position: fixed;
	display: flex;
	justify-content: center;
	align-items: center;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background: rgba(128, 128, 128, 0.5);
	z-index: 2000;
`;

const Box = styled.div`
	position: relative;
	padding: 70px 40px 30px;
	border-radius: 2em;
	background: white;
	z-index: 2050;

	${props => props.condensed && `
		padding: 0em 1em 0.5em 1em;
		border-radius: 1em;
	`}
`;

const CloseContainer = styled.div`
	position: absolute;
	top: 20px;
	right: 20px;
`;
const Close = styled.span`
	padding: 2px;
	border: 2px solid grey;
	border-radius: 30%;
	font-size: 18px;
	color: grey;
	cursor: pointer;
`;



const Content = styled.div`

`;

function Popup(props) {
	const { trigger, children, condensed } = props;

	const [isOpen, setOpen] = useState(false);

	const openHandler = () => {
		setOpen(true);
	};
	const closeHandler = () => {
		setOpen(false);
	};

	const contentClickHandler = e => e.stopPropagation();

	const renderTrigger = () => {
		const triggerProps = { onClick: openHandler };

		if (typeof trigger === "function") {
			return React.cloneElement(trigger(), triggerProps);
		}

		return React.cloneElement(trigger, triggerProps);
	};

	return (
		<>
			{renderTrigger()}
			{isOpen && (
				<Overlay onClick={closeHandler}>
					<Box onClick={contentClickHandler} condensed={condensed}>
						<CloseContainer onClick={closeHandler}>
							<Close className="glyphicon glyphicon-remove" />
						</CloseContainer>

						<Content>
							{typeof children === "function" ? children(closeHandler) : children}
						</Content>
					</Box>
				</Overlay>
			)}
		</>
	);
}

Popup.defaults = {
	condensed: false
};

Popup.propTypes = {
	condensed: PropTypes.bool,
	children: PropTypes.oneOfType([PropTypes.func, PropTypes.element]).isRequired,
	trigger: PropTypes.oneOfType([PropTypes.func, PropTypes.element]).isRequired
};

export default Popup;