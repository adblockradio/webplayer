import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledButton = styled.button`
	display: inline-flex;

	width: 200px;
	margin: 4px;
	padding: 7px 0 7px 20px;
	
	color: #333;
	font-size: 18px;
	text-align: left;
	vertical-align: middle;
	
	background-color: #fff;
	border-radius: 15px;
	box-shadow: 0 15px 10px -10px #ffffff66;

	${props =>
		props.active &&
		`
		color: #fff;
		background: #fe5c8e;
		box-shadow: 0 15px 10px -10px #fe5c8e88;
	`}
	
	${props =>
		props.disabled &&
		`
		color: #888;
		background: #ddd;
		box-shadow: none;
		cursor: not-allowed;
	`}

	${props =>
		props.condensed &&
		`
	`}
	${props =>
		props.iconOnly &&
		`
		width: auto;
		padding: 7px;
		text-align: center;
		border-radius: 10px;
	`}

	
	${props =>
		props.href &&
		`
		:hover {
			color: #333;
			text-decoration: none;
		}
	`}
	${props => !props.href && "border: 0 none;"}
`;

const StyledText = styled.span`
	display: inline-block;
	margin-left: 10px;
	width: 100%;
`;

const StyledIcon = styled.img`
	width: 25px;
	height: 25px;

	${props => props.active && "filter: invert(100%);"}
	${props => props.disabled && "filter: invert(50%);"}

	${props =>
		props.condensed &&
		`
		width: 20px;
		height: 20px;
	`}
`;

function Button(props) {
	const { label, active, disabled, condensed, iconOnly, href, icon, glyphicon, className, onClick } = props;

	const linkProps = { as: "a", href, target: "_blank", rel: "noopener noreferrer" };
	const buttonProps = { as: "button", onClick };
	const displayText = (condensed && !iconOnly) || !condensed;

	if (condensed && !icon && !glyphicon) {
		return null;
	}

	const iconElement = icon ? (
		<StyledIcon src={icon} active={active} disabled={disabled} condensed={condensed} />
	) : (
		<i className={`glyphicon glyphicon-${glyphicon}`}></i>
	);

	return (
		<StyledButton
			{...(href ? linkProps : buttonProps)}
			active={active}
			disabled={disabled}
			condensed={condensed}
			iconOnly={iconOnly}
			className={className}
		>
			{(icon || glyphicon) && iconElement}
			{displayText && label && <StyledText>{label}</StyledText>}
		</StyledButton>
	);
}

Button.defaults = {
	label: null,
	active: false,
	condensed: false,
	iconOnly: false,
	disabled: false,
	href: null,
	icon: null,
	glyphicon: null,
	className: null,
	onClick: null
};

Button.propTypes = {
	label: PropTypes.string,
	active: PropTypes.bool,
	condensed: PropTypes.bool,
	iconOnly: PropTypes.bool,
	disabled: PropTypes.bool,
	href: PropTypes.string,
	icon: PropTypes.string,
	glyphicon: PropTypes.string,
	className: PropTypes.string,
	onClick: PropTypes.func
};

export default React.memo(Button);
