import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import styled from "styled-components";

import thup from "../img/ratings_thumbs_up96.png";
import thdn from "../img/ratings_thumbs_down96.png";
import Popup from "./Popup.jsx";
import ok from "../img/ok_pink.png";

const FeedbackIcons = styled.div`
	display: flex;
	flex-direction: row;
	margin: auto;
	justify-content: center;
`;

const FeedbackTextStyle = {
	marginTop: "1em",
	width: "100%"
};

const FeedbackIcon = styled.img`
	width: 96px;
	height: 96px;
	margin: 2px;
	border-radius: 50%;
	border-style: solid;
	cursor: pointer;
	&.selected {
		width: 98px;
		height: 98px;
		border-width: 4px;
		padding: 0;
		margin: 0;
	}
`;

const FeedbackSend = styled.div`
	background-color: #fe5c8e;
	border-radius: 15px;
	width: 200px;
	cursor: pointer;
	text-align: center;
	padding: 7px 0px;
	color: white;
	margin: 30px auto 0px auto;
`;

export class Feedback extends Component {
	constructor(props) {
		super(props);
		this.state = { thdir: null, sent: false };
		this.iconClick = this.iconClick.bind(this);
		this.sendReview = this.sendReview.bind(this);
		this.close = this.close.bind(this);
		this.inputFeedbackRef = React.createRef();
	}

	iconClick(value) {
		if (this.state.thdir === value) {
			this.setState({ thdir: null });
		} else {
			this.setState({ thdir: value });
		}
	}

	sendReview() {
		this.props.send(this.state.thdir, this.inputFeedbackRef.current.value);
		//console.log("send review " + this.state.thdir + " text=" + this.refs.inputFeedback.value);
		this.setState({ sent: true });
		setTimeout(this.close, 3000);
	}

	close() {
		this.props.close();
	}

	render() {
		const lang = this.props.settings.config.uiLang;
		if (this.state.sent === false) {
			const contents = (
				<div>
					<h3>{{fr: "Que pensez-vous d'Adblock Radio?", en:"Rate your experience"}[lang]}</h3>
					<FeedbackIcons>
						<FeedbackIcon src={thup} alt={{fr:"Ça me plaît !",en:"I love it!"}[lang]} style={{ borderColor: "#40FF00" }} onClick={() => this.iconClick("up")} className={classNames({selected: this.state.thdir === "up"})} />
						<FeedbackIcon src={thdn} alt={{fr:"Peut mieux faire",en:"Can do better"}[lang]} style={{ borderColor: "#FF4000" }} onClick={() => this.iconClick("dn")} className={classNames({selected: this.state.thdir === "dn"})} />
					</FeedbackIcons>
					{this.state.thdir !== null &&
						<div>
							<p style={{marginTop: "1em"}}>
								{this.state.thdir === "up" ? {fr:"Super que le service vous plaise !", en:"Glad you like it!"}[lang] : {fr:"Dites-nous comment nous pourrions mieux faire.", en:"Tell us how to do better"}[lang] }
							</p>
							<textarea rows="3" ref={this.inputFeedbackRef} placeholder={{fr:"Donnez ici plus de détails…", en:"Please elaborate…"}[lang]} style={FeedbackTextStyle} />

							<FeedbackSend onClick={this.sendReview}>{{fr:"Envoyer", en:"Send"}[lang]}</FeedbackSend>
						</div>
					}
					<div style={{marginTop: "1em"}}>
						<a href="https://github.com/adblockradio/webplayor" target="_blank" rel="noopener noreferrer">{{fr:"Ce lecteur est open-source. Contribuez sur Github", en: "This player is free software. Contribute on Github"}[lang]}</a>
					</div>
				</div>
			);

			return (
				<Popup
					contents={contents}
					closeCallback={this.close}
					condensed={this.props.condensed}
				/>
			);

		} else {
			const contents = (
				<h3>{{fr:"Merci de votre retour !", en:"Thanks for your feedback!"}[lang]}</h3>
			);

			return (
				<Popup
					contents={contents}
					closeCallback={this.close}
					condensed={this.props.condensed}
					icon={ok}
					iconAlt={"OK"}
				/>
			);
		}
	}
}

Feedback.propTypes = {
	close: PropTypes.func.isRequired,
	send: PropTypes.func.isRequired,
	condensed: PropTypes.bool.isRequired,
	settings: PropTypes.object.isRequired,
};