import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import classNames from "classnames";

const RoundNumberDiv = styled.div`
	border-radius: 50%;
	width: 2em;
	height: 2em;
	margin: auto;
	font-size: 20px;
	text-align: center;
	padding-top: 0.3em;

	&.active {
		background: #ef66b0;
		color: white;
		font-weight: bold;
	}

	&.done {
		background: #dddddd;
		color: black;
	}

	&.done:hover {
		cursor: pointer;
	}

	&.disabled {
		background: white;
		border: 2px solid #dddddd;
		color: #dddddd;
		padding-top: calc(0.3em - 2px);
	}
`;

class RoundNumber extends Component {
	render() {
		return (
			<RoundNumberDiv style={this.props.style} className={
				classNames({active: this.props.active, disabled: this.props.disabled, done: this.props.done})
			}>
				{this.props.number}
			</RoundNumberDiv>
		);
	}
}

RoundNumber.propTypes = {
	active: PropTypes.bool.isRequired,
	disabled: PropTypes.bool.isRequired,
	done: PropTypes.bool.isRequired,
	number: PropTypes.number.isRequired,
	style: PropTypes.object
};

export default RoundNumber;
