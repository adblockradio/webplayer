import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import styled from "styled-components";

import RoundNumber from "../RoundNumber.js";

const StepLabel = styled.div`
	text-align: center;
	font-size: 18px;

	&.active {
		font-weight: bold;
	}

	&.disabled {
		color: #dddddd;
	}

	&.done:hover {
		cursor: pointer;
	}
`;

const StepContainer = styled.div`
	display: inline-block;
	width: 12vw;
	margin: 0 5px;
`;

class Step extends Component {
	render() {
		const active = this.props.number === this.props.currentStep;
		const disabled = this.props.number > this.props.currentStep;
		const done = this.props.number < this.props.currentStep;

		return (
			<StepContainer onClick={done ? this.props.onClick : null}>
				<RoundNumber active={active} disabled={disabled} done={done} number={this.props.number} />
				{!this.props.condensed &&
					<StepLabel className={classNames({active: active, disabled: disabled, done: done})}>
						{this.props.label}
					</StepLabel>
				}
			</StepContainer>
		);
	}
}

Step.propTypes = {
	number: PropTypes.number.isRequired,
	label: PropTypes.string.isRequired,
	currentStep: PropTypes.number.isRequired,
	onClick: PropTypes.func.isRequired,
	condensed: PropTypes.bool.isRequired
};

export default Step;