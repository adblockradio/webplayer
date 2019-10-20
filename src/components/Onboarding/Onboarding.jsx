import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import classNames from "classnames";

import consts from "../../consts.js";
import RegistrationStatus from "../RegistrationStatus.js";
import ListRadios from "../ListRadios";
import OnboardingSteps from "./OnboardingSteps.jsx";
import ChooseFilter from "./ChooseFilter.jsx";
import ChooseAction from "./ChooseAction.jsx";
import EndOnboarding from "./EndOnboarding.jsx";

import chevronLeft from "../../img/chevron_left_gray.svg";
import chevronRight from "../../img/chevron_right_white.svg";


const SlideContainer = styled.div`
	vertical-align: middle;
	text-align: center;
	/*height: 100%;
	flex-grow: 1;*/
	padding: 5%; /*0 10px;*/
	overflow: auto;
	/*display: flex;
	flex-direction: column;*/
	/*&.condensed {
		height: unset;
	}*/
`;


const OnboardingSlide = styled.div`
	/*position: absolute;*/
	text-align: left;
	font-size: 20px;
	/*display: table;*/
	height: 100%;
	width: 100%;
	width: inherit;
	display: flex;
	flex-direction: column;
`;


const ButtonsContainer = styled.div`
	/*height: 15vh;*/
	vertical-align: center;
	/*&.condensed {
		height: unset;
	}*/
	display: flex;
	flex-direction: row;
	padding: 12px;
	flex-basis: auto;
	flex-shrink: 0;
	max-width: 600px;
	margin: auto;
	width: 100%;
`;


/*const TableSteps = styled.table`
	margin: auto;
	position: absolute;
	top: 100vh;
	transform: translateY(calc(-100% - 5vh));
	left: 7vh;
`;*/

const OnboardingButton = styled.span`

	width: 100%;
	padding: 12px 0;
	border-radius: 4px;
	line-height: 1.42857143;
	text-align: center;
	white-space: nowrap;
	vertical-align: middle;
	user-select: none;
	display: inline-block;
	padding: 6px 12px;
	margin-bottom: 0;

	color: gray;
	background: white;
	border: 2px solid gray;

	&.active {
		color: white;
		background: #ef66b0;
		border: 2px solid #ef66b0;
	}

	&:hover {
		cursor: pointer;
	}
`;


const BottomCell = styled.div`
	/*width: 8%;
	&.condensed {
		width: 20%;
	}*/
	width: 60px;
	flex-grow: 1;
`;

const CellLabel = styled.span`
	margin: 10px;
	font-weight: bold;
	font-size: 16px;
`;

const CenterCell = styled.div`
	flex-grow: 1;
`;

const SlideInnerSpace = styled.div`
	flex-grow: 1;
`;

/*const GlyphStyle = {
	fontSize: "20px"
};*/
/*<div className="glyphicon glyphicon-chevron-left" aria-hidden="true" style={GlyphStyle}></div>

fill="#FFFFFF"

<svg width='200' height='200' fill="#000000" viewBox="0 0 556.23979 911.24985" version="1.1" x="0px" y="0px"><g transform="translate(1808.1217,-1979.6716)"><path style="" d="m -1580.6243,2663.4215 -227.4974,-227.5 228.1224,-228.125 c 125.4673,-125.4688 228.6882,-228.125 229.3797,-228.125 0.6915,0 23.1904,21.9385 49.9975,48.7522 l 48.7402,48.7522 -179.0587,179.0619 c -98.4823,98.4841 -179.0587,179.6245 -179.0587,180.312 0,0.6875 80.1553,81.4038 178.1228,179.3695 l 178.1229,178.1196 -48.4293,48.4413 c -26.6362,26.6427 -48.9952,48.4413 -49.6867,48.4413 -0.6915,0 -103.6311,-102.375 -228.7547,-227.5 z" fill="#000000"/></g></svg>
*/

const ChevronIcon = styled.img`
	height: 30px;
	margin: 5px 0px;
`;

class Onboarding extends Component {
	constructor(props) {
		super(props);
		this.state = {
			step: 1
		};
		this.handleClose = this.handleClose.bind(this);
		this.nextStep = this.nextStep.bind(this);
		this.prevStep = this.prevStep.bind(this);
		this.setStep = this.setStep.bind(this);
		this.nSteps = 5;
	}

	handleClose() {
		this.props.closeOnboarding();
	}

	nextStep() {
		if (this.state.step >= this.nSteps) return this.handleClose();
		this.setState({"step": this.state.step + 1});
	}

	prevStep() {
		if (this.state.step <= 1) return;
		this.setState({"step": this.state.step - 1});
	}

	setStep(step) {
		this.setState({"step": step});
	}

	render() {
		let settings = this.props.settings;
		let regstatus = settings.accountStatus();
		let self = this;
		let forceUpdateParent = () => { self.forceUpdate(); };


		let contents = <div></div>;
		let nextStep = true;

		if (this.state.step === 1) {
			contents = <RegistrationStatus bsw={this.props.bsw} settings={settings} regstatus={regstatus} forceUpdateParent={forceUpdateParent} condensed={this.props.condensed} />;
			nextStep = regstatus === consts.UI_REGISTERED;

		} else if (this.state.step === 2) {
			contents = <ListRadios bsw={this.props.bsw} settings={this.props.settings} catalog={this.props.catalog} condensed={this.props.condensed} />;
			nextStep = this.props.settings.radios.length > 0;

		} else if (this.state.step === 3) {
			contents = <ChooseFilter bsw={this.props.bsw} settings={this.props.settings} condensed={this.props.condensed} />;

		} else if (this.state.step === 4) {
			contents = <ChooseAction bsw={this.props.bsw} settings={this.props.settings} condensed={this.props.condensed} />;

		} else if (this.state.step === 5) {
			contents = 	<EndOnboarding condensed={this.props.condensed} settings={settings} />;
		}

		let firstStep = this.state.step <= 1;

		return (
			<OnboardingSlide className={classNames({condensed: this.props.condensed})}>
				<OnboardingSteps step={this.state.step} setStep={this.setStep} condensed={this.props.condensed} settings={this.props.settings} />

				<SlideInnerSpace></SlideInnerSpace>
				<SlideContainer className={classNames({condensed: this.props.condensed})}>
					{contents}
				</SlideContainer>
				<SlideInnerSpace></SlideInnerSpace>

				<ButtonsContainer>
					<BottomCell className={classNames({ condensed: this.props.condensed })}>
						{!firstStep &&
							<OnboardingButton className={classNames({ active: false })} onClick={this.prevStep}>
								<ChevronIcon src={chevronLeft} />
								{!this.props.condensed &&
									<CellLabel>{{fr:"Retour",en:"Back"}[settings.config.uiLang]}</CellLabel>
								}

							</OnboardingButton>
						}
					</BottomCell>
					<CenterCell></CenterCell>
					<BottomCell className={classNames({ condensed: this.props.condensed, active: true })}>
						{nextStep &&
							<OnboardingButton className={classNames({ active: true })} onClick={this.nextStep}>
								{!this.props.condensed &&
									<CellLabel>{{fr:"Continuer",en:"Next"}[settings.config.uiLang]}</CellLabel>
								}
								<ChevronIcon src={chevronRight} />
							</OnboardingButton>
						}
					</BottomCell>
				</ButtonsContainer>

			</OnboardingSlide>
		);
	}
}

Onboarding.propTypes = {
	bsw: PropTypes.object.isRequired,
	settings: PropTypes.object.isRequired,
	closeOnboarding: PropTypes.func.isRequired,
	catalog: PropTypes.array.isRequired,
	condensed: PropTypes.bool.isRequired
};


export default Onboarding;
