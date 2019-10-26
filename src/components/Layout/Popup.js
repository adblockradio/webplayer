import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import breakpoint from "../../helpers/breakpoint";

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
	padding: 15px;
	margin: 20px;
	border-radius: 14px;
	background: white;
	z-index: 2050;

	${breakpoint.min.l`
		padding: 70px 40px 30px;
		border-radius: 28px;
	`}
`;

const CloseContainer = styled.div`
	position: absolute;
	top: -10px;
	right: -10px;

	${breakpoint.min.l`
		top: 20px;
		right: 20px;
	`}
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
	const { trigger, children } = props;

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
					<Box onClick={contentClickHandler}>
						<CloseContainer onClick={closeHandler}>
							<Close className="glyphicon glyphicon-remove" />
						</CloseContainer>

						{typeof children === "function" ? children(closeHandler) : children}
					</Box>
				</Overlay>
			)}
		</>
	);
}

Popup.propTypes = {
	children: PropTypes.oneOfType([PropTypes.func, PropTypes.element]).isRequired,
	trigger: PropTypes.oneOfType([PropTypes.func, PropTypes.element]).isRequired
};

export default Popup;
