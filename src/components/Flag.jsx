import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import classNames from "classnames";

import Popup from "./Popup.jsx";
import CountryFlag from "./CountryFlag.js";

import ok from "../img/ok_pink.png";

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

const LeftList = styled.ul`
	text-align: left;
`;

class Flag extends Component {
	render() {
		const lang = this.props.settings.config.uiLang;

		const unmaintainedRadios = this.props.settings.radios.filter(r => r.unmaintained).map(r => { return { country: r.country, name: r.name }; });
		//console.log(unmaintainedRadios);

		if (unmaintainedRadios.length === 0) {
			setTimeout(this.props.close, 4000);
			const contents = (
				<div>
					<h3>{{fr:"Merci du signalement",en:"Thanks for your contribution"}[lang]}</h3>
					<p>{{fr:"Un signalement toutes les 2-3 minutes suffit", en:"A flag every 2-3 minutes is enough"}[lang]}</p>
				</div>
			);
			return (
				<Popup
					contents={contents}
					icon={ok}
					iconAlt={"OK"}
					condensed={this.props.condensed}
				/>
			);
		} else {

			const list = !this.props.condensed
				? unmaintainedRadios.map(function(r, i) {
					return <span key={"unm" + i}>
						<CountryFlag country={r.country} selected={false} width={32} height={24} />
						{r.name}
					</span>;
				})
				: <LeftList>
					{unmaintainedRadios.map(function(r, i) {
						return (
							<li key={"unm" + i}>{r.name}</li>
						);
					})}
				</LeftList>;

			const contents = (
				<div>
					<h3>{{fr:"Merci du signalement",en:"Thanks for your contribution"}[lang]}</h3>
					<p>{{fr:"Pour garantir la qualité du filtre à publicités, Adblock Radio a besoin de votre aide pour:", en:"To guarantee the quality of the ad filters, Adblock Radio needs your help to support:"}[lang]}</p>
					<p>{list}</p>
					<p>
						<a href="https://www.adblockradio.com/blog/2019/09/26/about-becoming-a-maintainer/" target="_blank" rel="noopener noreferrer" onClick={this.props.close}>
							<OnboardingButton className={classNames({ active: true })}>
								{{fr:"Je veux en savoir plus", en: "Tell me more about this"}[lang]}
							</OnboardingButton>
						</a>
					</p>
					<p onClick={this.props.close}>
						<OnboardingButton>
							{{fr:"Fermer", en: "Close"}[lang]}
						</OnboardingButton>
					</p>
				</div>
			);

			return (
				<Popup
					contents={contents}
					closeCallback={!this.props.condensed && this.props.close}
					icon={!this.props.condensed && ok}
					iconAlt={"OK"}
					condensed={this.props.condensed}
				/>
			);
		}
	}
}

Flag.propTypes = {
	close: PropTypes.func.isRequired,
	settings: PropTypes.object.isRequired,
	condensed: PropTypes.bool.isRequired,
};

export default Flag;