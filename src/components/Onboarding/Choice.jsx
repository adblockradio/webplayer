import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import classNames from "classnames";

const TRANSITION_BTN = "0s";

const ChoiceItem = styled.div`
	border-radius: 15px;
	border: 2px solid #dddddd;
	display: flex;
	padding: 10px 10px 10px 30px;
	margin: 10px;
	cursor: pointer;
	transition: ${TRANSITION_BTN};
	text-align: left;
	flex-grow: 1;

	&.selected {
		border-color: #ef66b0;
	}
	&.disabled {
		border-color: #dddddd;
		cursor: not-allowed;
	}
	&.condensed {
		margin: 10px 0;
		padding: 10px 10px 10px 20px;
	}
`;

const ChoiceMark = styled.div`
	/*display: inline-block;*/
	align-self: center;
	border-radius: 50%;
	width: 30px;
	height: 30px;
	border: 2px solid #ef66b0;
	background: white;
	transition: ${TRANSITION_BTN};
	flex-shrink: 0;

	&.selected {
		background: #ef66b0;
	}
	&.disabled {
		background: white;
		border: 2px solid #dddddd;
	}
	&.condensed {
		width: 20px;
		height: 20px;
	}
`;

const ChoiceText = styled.div`
	flex-grow: 1;
	padding: 10px;
	display: inline-block;
	align-self: center;
	text-align: left;
	margin-left: 10px;
	&.disabled {
		color: #dddddd;
	}
	&.condensed {
		padding: 0 0 0 10px;
	}
`;

const ChoiceIcon = styled.img`
	vertical-align: middle;
	width: 25px;
	height: 25px;
	margin: 5px;
	&.disabled {
		filter: invert(50%);
	}
	&.condensed {
		width: 20px;
		height: 20px;
	}
`;

const ChoiceTitle = styled.p`
	font-size: 20px;
	font-weight: bold;
	&.condensed {
		font-size: 16px;
		margin-bottom: 0.2em;
		font-weight: unset;
	}
`;


const IconContainer = styled.div`
	width: 60px;
	margin: 10px;
	align-self: center;
	text-align: center;
	display: inline-block;

	&.large {
		width: 110px;
	}
	&.condensed {
		width: 32px;
	}
`;

const Description = styled.p`
	font-size: 20px;
	&.condensed {
		font-size: 14px;
	}
`;

const Choice = (props) => {
	const { current, value, disabled } = props;
	const selected = current === value;
	return (
		<ChoiceItem
			className={classNames({selected: selected, disabled: disabled, condensed: props.condensed})}
			onClick={() => props.onClick(props.value)}>

			<ChoiceMark className={classNames({selected: selected, disabled: disabled, condensed: props.condensed})} />
			<ChoiceText className={classNames({disabled: disabled, condensed: props.condensed})}>
				<ChoiceTitle className={classNames({condensed: props.condensed})}>{props.title}</ChoiceTitle>
				<Description className={classNames({condensed: props.condensed})}>{props.description}</Description>
			</ChoiceText>
			<IconContainer className={classNames({large: props.multiIcons, condensed: props.condensed})}>
				{props.icons.map(function(icon, i) {
					return <ChoiceIcon src={icon} key={"result" + i}
						className={classNames({disabled: disabled, condensed: props.condensed})} />;
				})}
			</IconContainer>
		</ChoiceItem>
	);
};

Choice.propTypes = {
	value: PropTypes.number.isRequired,
	current: PropTypes.number.isRequired,
	multiIcons: PropTypes.bool.isRequired,
	title: PropTypes.string.isRequired,
	icons: PropTypes.array.isRequired,
	description: PropTypes.string.isRequired,
	disabled: PropTypes.bool,
	condensed: PropTypes.bool,
	onClick: PropTypes.func.isRequired,
};

export default Choice;