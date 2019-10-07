import React, { Component } from "react";
import PropTypes from "prop-types";
import consts from "../consts.js";
import styled from "styled-components";
import classNames from "classnames";
import FlagContainer from "./CountryFlag.js";

import { ShareButtons } from "react-share"; //generateShareIcon
//const TwitterIcon = generateShareIcon('twitter');

class TwitterIcon extends Component {
	render() {
		return (
			<svg viewBox="0 0 64 64" fill="white" width={this.props.size} height={this.props.size} style={{verticalAlign: "middle", marginLeft: "15px"}}>
				<g><circle cx="32" cy="32" r="31" fill="#00aced"></circle></g>
				<g><path d="M48,22.1c-1.2,0.5-2.4,0.9-3.8,1c1.4-0.8,2.4-2.1,2.9-3.6c-1.3,0.8-2.7,1.3-4.2,1.6 C41.7,19.8,40,19,38.2,19c-3.6,0-6.6,2.9-6.6,6.6c0,0.5,0.1,1,0.2,1.5c-5.5-0.3-10.3-2.9-13.5-6.9c-0.6,1-0.9,2.1-0.9,3.3 c0,2.3,1.2,4.3,2.9,5.5c-1.1,0-2.1-0.3-3-0.8c0,0,0,0.1,0,0.1c0,3.2,2.3,5.8,5.3,6.4c-0.6,0.1-1.1,0.2-1.7,0.2c-0.4,0-0.8,0-1.2-0.1 c0.8,2.6,3.3,4.5,6.1,4.6c-2.2,1.8-5.1,2.8-8.2,2.8c-0.5,0-1.1,0-1.6-0.1c2.9,1.9,6.4,2.9,10.1,2.9c12.1,0,18.7-10,18.7-18.7 c0-0.3,0-0.6,0-0.8C46,24.5,47.1,23.4,48,22.1z"></path></g>
			</svg>
		);
	}
}

TwitterIcon.propTypes = {
	size: PropTypes.number.isRequired
};

class UserIcon extends Component {
	render() {
		return(
			<svg viewBox="0 0 100 100" fill="#000000" width={this.props.size} height={this.props.size} x="0px" y="0px" enableBackground="new 0 0 100 100" style={{verticalAlign: "middle"}}>
				<g display="none">
					<rect x="-878.378" y="-174.877" display="inline" fill="#000000" stroke="#000000" strokeWidth="4" strokeMiterlimit="10" width="1243.174" height="368.982"/>
				</g>
				<g>
					<path d="M59.343,50.808c2.092-2.317,3.245-5.312,3.245-8.431c0-6.944-5.65-12.594-12.594-12.594S37.4,35.433,37.4,42.378   c0,3.118,1.153,6.112,3.248,8.432c2.384,2.637,5.791,4.15,9.346,4.15C53.55,54.96,56.958,53.447,59.343,50.808z"/>
					<g>
						<path fill="none" d="M49.994,9.63C27.737,9.63,9.63,27.742,9.63,50.006c0,12.373,5.576,23.853,15.107,31.486V68.735 c0-6.883,4.308-12.882,10.576-15.195l1.04,1.15c3.481,3.85,8.453,6.058,13.641,6.058c5.189,0,10.161-2.208,13.642-6.058l1.04-1.15    c6.268,2.313,10.576,8.312,10.576,15.195v12.762C84.79,73.876,90.37,62.393,90.37,50.006C90.37,27.742,72.257,9.63,49.994,9.63z"/>
						<path d="M49.994,5C25.185,5,5,25.189,5,50.006c0,9.067,2.766,18.039,7.92,25.503c2.221,3.216,4.977,6.017,7.972,8.515    c1.515,1.263,3.09,2.452,4.694,3.6c2.643,1.891,5.329,3.246,8.392,4.418c1.675,0.641,3.389,1.181,5.129,1.617    C42.664,94.55,46.328,95,49.994,95c3.58,0,7.147-0.494,10.613-1.379c1.754-0.448,3.482-0.994,5.181-1.62    c0.879-0.324,1.751-0.67,2.614-1.034c2.021-0.854,3.937-1.835,5.79-3.026c0,0,1.061-0.678,1.061-0.678v-0.047    C87.633,78.823,95,65.02,95,50.006C95,25.189,74.811,5,49.994,5z M75.253,81.497V68.735c0-6.883-4.308-12.882-10.576-15.195    l-1.04,1.15c-3.481,3.85-8.453,6.058-13.642,6.058c-5.188,0-10.16-2.208-13.641-6.058l-1.04-1.15    c-6.268,2.313-10.576,8.312-10.576,15.195v12.756C15.207,73.858,9.63,62.379,9.63,50.006C9.63,27.742,27.737,9.63,49.994,9.63    c22.263,0,40.375,18.112,40.375,40.375C90.37,62.393,84.79,73.876,75.253,81.497z"/>
					</g>
				</g>
			</svg>
		);
	}
}

UserIcon.propTypes = {
	size: PropTypes.number.isRequired
};

const ChoiceL10nContainer = styled.div`
	margin: 1em 0 1em 0;
`;

class ChoiceL10N extends Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(code) {
		console.log("choiceL10N click: " + code);
		this.props.settings.setUILang(code);
	}
	render() {
		let currentUiLang = this.props.settings.config.uiLang;
		//console.log("currentUiLang=" + currentUiLang);
		let self = this;
		return (
			<ChoiceL10nContainer>
				{consts.LANGS.map(function(lang, index) {
					return (
						<FlagContainer country={lang} key={index} selected={currentUiLang === lang}
							onClick={() => self.handleClick(lang)}>
						</FlagContainer>
					);
				})}
			</ChoiceL10nContainer>
		);
	}
}
//<Flag src={flags[consts.LANGS[1]]} className={classNames({selected: currentUiLang === consts.LANGS[1]})} onClick={() => this.handleClick(consts.LANGS[1])}></Flag>
ChoiceL10N.propTypes = {
	settings: PropTypes.object.isRequired
};

const Title = styled.p`
	font-size: 36px;
	&.condensed {
		font-size: 26px;
	}
`;

const Text = styled.p`
	font-size: 20px;
	&.condensed {
		font-size: 14px;
	}
`;

const SmallText = styled.p`
	margin: 0;
	font-size: 16px;
`;

const Link = styled.span`
	&:hover {
		text-decoration: underline;
		cursor: pointer;
	}
`;

class RegistrationStatus extends Component {
	constructor(props) {
		super(props);
		this.state = {
			submitted: false
		};
		this.submit = this.submit.bind(this);
	}

	submit(email) {
		this.props.bsw.apikeySetup(email, true);
		console.log("email = " + email);
		this.setState({ submitted: true});
		//this.props.forceUpdateParent();
	}

	UNSAFE_componentWillReceiveProps(nextProps) { // TODO migrate this
		if ([consts.UI_WAIT_CONFIRM, consts.UI_WITHOUT_EMAIL, consts.UI_REGISTERED, consts.UI_OPEN_EMAIL].indexOf(nextProps.regstatus) >= 0) {
			this.setState({ submitted: false });
		}
	}
	render() {
		let settings = this.props.settings;
		let bsw = this.props.bsw;
		let component = <div>Erreur</div>;
		let lang = settings.config.uiLang;
		if (this.props.regstatus === consts.UI_NEED_EMAIL || this.state.submitted) {
			//console.log("reg status = need email");
			component = (
				<NeedEmail bsw={bsw} settings={settings} submit={this.submit} submitted={this.state.submitted} condensed={this.props.condensed} />
			);

		/*} else if (this.props.regstatus === consts.UI_WAIT_CONFIRM) {
			console.log("reg status = wait confirm. api key is " + settings.account.apikey);
			component = (
				<div>
					<div>
						<Title className={classNames({condensed: this.props.condensed})}>{{fr: "Vous recevrez bientôt un email d'invitation\xa0!", en: "You will soon receive an invitation email!"}[lang]}</Title>
						<Text className={classNames({condensed: this.props.condensed})}>{{fr: "Nous envoyons les invitations par vagues. Soyez patient\xa0!", en:"We send invitation emails in waves. Please be patient!"}[lang]}<br />{{fr:"Vraiment pressé d'essayer\xa0? Faites-nous signe à contact (at) adblockradio.com", en:"Can't wait to test? Send us an email at contact (at) adblockradio.com"}[lang]}</Text>
					</div>
					<Account settings={settings} forceUpdateParent={this.props.forceUpdateParent} condensed={this.props.condensed} />
					<div style={{marginTop: "3em"}}>
						<ShareSocialMedia  condensed={this.props.condensed} lang={lang} />
					</div>
				</div>
			);
*/
		} else if (this.props.regstatus === consts.UI_WAIT_CONFIRM || this.props.regstatus === consts.UI_OPEN_EMAIL) {
			console.log("reg status = open email to login. api key is " + settings.account.apikey);
			component = (
				<div>
					<div>
						<Title className={classNames({condensed: this.props.condensed})}>{{fr: "Vous avez reçu un email", en: "We just sent you an email"}[lang]}</Title>
						<Text className={classNames({condensed: this.props.condensed})}>{{fr: "Ouvrez le lien qu'il contient pour accéder au service.", en:"Open the link inside to gain access to the player."}[lang]}<br />{{fr:"Pas de mail à l'horizon\xa0? Vérifiez aussi vos spams.", en:"Email not received? Check your spam folder."}[lang]}</Text>
					</div>
					<Account settings={settings} forceUpdateParent={this.props.forceUpdateParent} condensed={this.props.condensed} />
					<div style={{marginTop: "3em"}}>
						<ShareSocialMedia  condensed={this.props.condensed} lang={lang} />
					</div>
				</div>
			);

		} else if (this.props.regstatus === consts.UI_WITHOUT_EMAIL) {
			//console.log("reg status = change email");
			component = <Account settings={settings} forceUpdateParent={this.props.forceUpdateParent} condensed={this.props.condensed} />;

		} else if (this.props.regstatus === consts.UI_REGISTERED) {
			//console.log("reg status = registered");
			component = (
				<div>
					<div>
						<Title className={classNames({condensed: this.props.condensed})}>
							{{fr:"Bienvenue sur Adblock Radio", en:"Welcome on Adblock Radio"}[lang]}
						</Title>
						<Text className={classNames({condensed: this.props.condensed})}>
							{{fr:"Une meilleure expérience de la radio grâce à un filtre à pubs open-source.", en:"A better experience of radio with an open source ad filter."}[lang] + " "}
							<a target="_blank" rel="noopener noreferrer" href="https://www.adblockradio.com/blog/2018/11/15/designing-audio-ad-block-radio-podcast/">{{fr:"Plus d'infos", en:"Learn more"}[lang]}.</a>
						</Text>
						<Text className={classNames({condensed: this.props.condensed})}>
							{{fr:"Laissez-vous guider pour personnaliser votre écoute.", en:"Follow the quick steps to customize your player."}[lang]}
						</Text>
					</div>
					<Account settings={settings} forceUpdateParent={this.props.forceUpdateParent} condensed={this.props.condensed} />
					<ChoiceL10N settings={this.props.settings}></ChoiceL10N>
				</div>
			);
		}

		return component;
	}
}

RegistrationStatus.propTypes = {
	settings: PropTypes.object.isRequired,
	bsw: PropTypes.object.isRequired,
	regstatus: PropTypes.number.isRequired,
	forceUpdateParent: PropTypes.func.isRequired,
	condensed: PropTypes.bool.isRequired,
};

/*<ShareSocialMedia style={{marginTop: this.props.condensed ? "0" : "3em"}} condensed={this.props.condensed} />*/


/*const TdSocial = styled.td`
	padding: 10px 10px 10px 0;
`;*/

class Account extends Component {
	constructor(props) {
		super(props);
		this.handleChangeEmail = this.handleChangeEmail.bind(this);
	}

	handleChangeEmail() {
		this.props.settings.resetAccount();
		console.log("email is now " + this.props.settings.account.email);
		this.props.forceUpdateParent();
	}

	render() {
		const lang = this.props.settings.config.uiLang;
		return (
			<Text className={classNames({condensed: this.props.condensed})} style={{marginTop: this.props.condensed ? "0" : "2em"}}>
				<UserIcon size={32} />&nbsp;{{fr: "Connecté avec ", en: "Connected as "}[lang] + this.props.settings.account.email} – <Link onClick={this.handleChangeEmail}>{{fr:"Déconnexion", en:"Log out"}[lang]}</Link>
			</Text>
		);
	}
}

Account.propTypes = {
	condensed: PropTypes.bool.isRequired,
	settings: PropTypes.object.isRequired,
	forceUpdateParent: PropTypes.func.isRequired
};

class ShareSocialMedia extends Component {
	render() {
		return(
			<Link>
				<ShareButtons.TwitterShareButton
					url="https://www.adblockradio.com/"
					title={{fr: "Avec Adblock Radio, écoutez la radio avec ou sans la pub", en: "Adblock Radio lets you skip ads on the radio"}[this.props.lang]}
					hashtags={["adblockradio", "adblock"]}>
					<Text className={classNames({condensed: this.props.condensed})}>{{fr: "Faites découvrir Adblock Radio à vos relations sur Twitter\xa0!", en: "Introduce Adblock Radio to your Twitter followers!"}[this.props.lang]}</Text>
					<TwitterIcon size={48} />
				</ShareButtons.TwitterShareButton>
			</Link>
		);
	}
}

ShareSocialMedia.propTypes = {
	condensed: PropTypes.bool.isRequired,
	lang: PropTypes.string.isRequired
};

class NeedEmail extends Component {
	constructor(props) {
		super(props);
		this.handleSubmitEmail = this.handleSubmitEmail.bind(this);
		this.inputChangeEmail = this.inputChangeEmail.bind(this);
		this.inputKeyUp = this.inputKeyUp.bind(this);
		this.state = {
			email: "",
		};
	}

	inputChangeEmail(evt) {
		this.setState({ "email": evt.target.value });
	}

	inputKeyUp(evt) {
		if (evt.keyCode === 13) {
			this.handleSubmitEmail();
		}
	}

	handleSubmitEmail() {
		let emailValid = this.props.bsw.validateEmail(this.state.email);
		if (!emailValid) {
			return console.log("email does not seem to be valid. please retry.");
		}
		this.props.submit(this.state.email);//forceUpdateParent();
	}

	render() {
		var lang = this.props.settings.config.uiLang;
		return (
			<div>
				<Title className={classNames({condensed: this.props.condensed})}>{{fr: "Renseignez votre adresse email", en: "Fill in your email"}[lang]}</Title>
				<Text className={classNames({condensed: this.props.condensed})}>{{fr: "Nous allons vous envoyer un lien de connexion", en: "We will send you a login link"}[lang]}</Text>
				{this.props.submitted ?
					{fr:"Juste un instant…", en:"We're almost there…"}[lang]
					:
					<div className="form-inline">
						<div className="form-group">
							<label className="sr-only" htmlFor="emailInput">{{fr: "Adresse email", en: "Email address"}[lang]}</label>
							<input type="email" className="form-control" id="emailInput" placeholder="Email" value={this.state.email} onChange={this.inputChangeEmail} onKeyUp={this.inputKeyUp} />
						</div>
						<button className={classNames({btn: true, "btn-default": true })} id="emailSubmit" onClick={this.handleSubmitEmail}>{{fr: "Envoyer", en: "Send"}[lang]}</button>
					</div>
				}
				<ChoiceL10N settings={this.props.settings}></ChoiceL10N>
				<Text className={classNames({condensed: this.props.condensed})}>{{fr: "Politique vie privée :", en: "Privacy policy:"}[lang]}</Text>
				<SmallText className={classNames({condensed: this.props.condensed})}>{{fr: "Nous ne communiquons votre adresse email à personne, sauf au prestataire technique d'envoi des emails (Mailgun).", en: "We do not share your email address with any third party, except the email service provider (Mailgun)."}[lang]}</SmallText>
				<SmallText className={classNames({condensed: this.props.condensed})}>{{fr: "Nous envoyons une newsletter occasionnelle, tous les deux mois environ, liée à l'évolution d'Adblock Radio.", en: "We send an occasional newsletter, every two months or so, to keep you updated about Adblock Radio."}[lang]}</SmallText>
				<SmallText className={classNames({condensed: this.props.condensed})}>{{fr: "Désinscription définitive en deux clics. Suppression des données sur demande.", en: "Permanent unsubscription in two clicks. Data deletion on demand."}[lang]}</SmallText>
			</div>
		);
	}
}

NeedEmail.propTypes = {
	bsw: PropTypes.object.isRequired,
	submit: PropTypes.func.isRequired,
	condensed: PropTypes.bool.isRequired,
	submitted: PropTypes.bool.isRequired,
	settings: PropTypes.object.isRequired
};

export default RegistrationStatus;
