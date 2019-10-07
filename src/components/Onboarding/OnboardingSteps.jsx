import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Step from "./Step.jsx";

const StepsContainer = styled.div`
	margin: 20px auto 10px auto;
	display: flex;
	flex-basis: auto;
    flex-shrink: 0;
`;

class OnboardingSteps extends Component {
	constructor(props) {
		super(props);
		this.setStep = this.setStep.bind(this);
	}

	setStep(step) {
		this.props.setStep(step);
	}

	render() {
		const lang = this.props.settings.config.uiLang;
		return (
			<StepsContainer>
				<Step number={1} label={{fr:"Bienvenue",en:"Welcome"}[lang]} currentStep={this.props.step} onClick={() => this.setStep(1)} condensed={this.props.condensed} />
				<Step number={2} label={{fr:"Choix des radios",en:"Choose radios"}[lang]} currentStep={this.props.step} onClick={() => this.setStep(2)} condensed={this.props.condensed} />
				<Step number={3} label={{fr:"Type de filtrage",en:"Filtered content"}[lang]} currentStep={this.props.step} onClick={() => this.setStep(3)} condensed={this.props.condensed} />
				<Step number={4} label={{fr:"Action de filtrage",en:"Filtering action"}[lang]} currentStep={this.props.step} onClick={() => this.setStep(4)} condensed={this.props.condensed} />
				<Step number={5} label={{fr:"Prêt au décollage !",en:"Ready to go!"}[lang]} currentStep={this.props.step} onClick={() => this.setStep(5)} condensed={this.props.condensed} />
			</StepsContainer>
		);
	}
}

OnboardingSteps.propTypes = {
	step: PropTypes.number.isRequired,
	setStep: PropTypes.func.isRequired,
	condensed: PropTypes.bool.isRequired,
	settings: PropTypes.object.isRequired
};

export default OnboardingSteps;