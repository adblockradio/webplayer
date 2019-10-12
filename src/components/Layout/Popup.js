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
	margin: 20px;
	border-radius: 28px;
	background: white;
	z-index: 2050;

	${props =>
		props.condensed &&
		`
		padding: 15px;
		border-radius: 14px;
	`}
`;

const CloseContainer = styled.div`
	position: absolute;
	${props => (props.condensed ? "top: -10px; right: -10px;" : "top: 20px; right: 20px;")}
`;

const Close = styled.span`
	padding: 2px;
	border: 2px solid grey;
	border-radius: 30%;
	font-size: 18px;
	color: grey;
	cursor: pointer;
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
						<CloseContainer onClick={closeHandler} condensed={condensed}>
							<Close className="glyphicon glyphicon-remove" />
						</CloseContainer>

						{typeof children === "function" ? children(closeHandler) : children}
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
