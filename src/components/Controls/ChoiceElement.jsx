import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import styled from "styled-components";

const TRANSITION_BTN = "0.2s ease-in-out";
const COLOR_BTN_OFF = "#ffffff";
const COLOR_BTN_ON = "#fe5c8e";

const ChoiceIcon = styled.img`
	vertical-align: middle;
	width: 25px;
	height: 25px;
	transition: ${TRANSITION_BTN};

	&.active {
		filter: invert(100%);
	}
	&.disabled {
		filter: invert(50%);
	}
	&.condensed {
		width: 20px;
		height: 20px;
	}
`;

const ChoiceButton = styled.div`
	color: #333;
	box-shadow: 0 15px 10px -10px ${COLOR_BTN_OFF}66;
	background-color: ${COLOR_BTN_OFF};
	padding: 7px 0px 7px 20px;
	margin: 4px;
	text-align: left;
	cursor: pointer;
	border-radius: 15px;
	width: 200px;
	transition: ${TRANSITION_BTN};
	/*border: 2px solid black;*/

	&.active {
		background: ${COLOR_BTN_ON};
		box-shadow: 0 15px 10px -10px ${COLOR_BTN_ON}88;
		color: #fff;
	}

	&.disabled {
		background: #ddd;
		box-shadow: unset;
		color: #888;
		cursor: not-allowed;
	}

	&.condensed {
		padding: 7px;
		width: unset;
		margin: 0;
		border-radius: 0px;
		text-align: center;
	}

	&.condensed.top {
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	}

	&.condensed.bottom {
		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;
	}

`;

const ChoiceDescription = styled.span`
	margin-left: 10px;
	font-size: 18px;
	vertical-align: middle;
`;

class ChoiceElement extends Component {
	render() {
		const { active, condensed, expanded, disabled, caption, logo, first, last } = this.props;
		const onClick = this.props.setParam ? this.props.setParam : function() {};
		const Button = (
			<ChoiceButton
				className={classNames({ active,
					condensed,
					top: first,
					bottom: last,
					disabled })}
				onClick={onClick}>

				<ChoiceIcon className={classNames({ active, condensed, disabled })} src={logo} alt={caption} />
				{(condensed === false || (condensed === true && expanded === true)) &&
					<ChoiceDescription>{caption}</ChoiceDescription>
				}
			</ChoiceButton>
		);

		return (
			<tr>
				<td>
					{this.props.externalLink
						? ( <a href={this.props.externalLink} target="_blank" rel="noopener noreferrer">{Button}</a> )
						: ( <div>{Button}</div> )
					}
				</td>
			</tr>
		);
	}
}

ChoiceElement.propTypes = {
	active: PropTypes.bool.isRequired,
	caption: PropTypes.string.isRequired,
	logo: PropTypes.string.isRequired,
	setParam: PropTypes.func,
	condensed: PropTypes.bool.isRequired,
	first: PropTypes.bool,
	last: PropTypes.bool,
	disabled: PropTypes.bool,
	expanded: PropTypes.bool,
	externalLink: PropTypes.string,
};

export default ChoiceElement;