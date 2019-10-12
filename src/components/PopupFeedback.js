import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Popup from "./Layout/Popup.js";
import Button from "./Controls/Button";

import imgThumbsUp from "../img/ratings_thumbs_up96.png";
import imgThumbsDown from "../img/ratings_thumbs_down96.png";
import imgOk from "../img/ok_pink.png";

const Title = styled.h3`
	margin-top: 0;
`;

const ThumbsIcon = styled.img`
	width: 96px;
	height: 96px;
	padding: 4px;
	cursor: pointer;
	border: 4px solid transparent;
	border-radius: 50%;
	transition: 0.15s ease-in-out border;

	${props => props.selected && props.up && "border-color: #40FF00"}
	${props => props.selected && props.down && "border-color: #FF4000"}
`;

const ThumbsDesc = styled.p`
	margin-top: 15px;
`;

const StyledButton = styled(Button)`
	margin-top: 30px;
`;

const Footer = styled.p`
	margin-top: 15px;
	margin-bottom: 0;
`;

function PopupFeedback(props) {
	const { onSend, trigger, uiLang, condensed } = props;

	const [isSent, setSent] = useState(false);
	const [thumbs, setThumbs] = useState();
	const textareaRef = useRef(null);

	const thumbsUpHandler = () => setThumbs(thumbs !== "up" ? "up" : null);
	const thumbsDownHandler = () => setThumbs(thumbs !== "down" ? "down" : null);

	const sendHandler = callback => {
		setSent(true);
		onSend(thumbs, textareaRef.current.value);
		textareaRef.current.value = "";
		setThumbs(null);

		setTimeout(() => {
			setSent(false);
			callback();
		}, 3000);
	};

	const title = { fr: "Que pensez-vous d'Adblock Radio?", en: "Rate your experience" }[uiLang];
	const descUp = { fr: "Super que le service vous plaise !", en: "Glad you like it!" }[uiLang];
	const descDown = { fr: "Dites-nous comment nous pourrions mieux faire.", en: "Tell us how to do better" }[uiLang];
	const altUp = { fr: "Ça me plaît !", en: "I love it!" }[uiLang];
	const altDown = { fr: "Peut mieux faire", en: "Can do better" }[uiLang];
	const contrib = {
		fr: "Ce lecteur est open-source. Contribuez sur Github",
		en: "This player is free software. Contribute on Github"
	}[uiLang];
	const thanks = { fr: "Merci de votre retour !", en: "Thanks for your feedback!" }[uiLang];
	const placeholder = { fr: "Donnez ici plus de détails…", en: "Please elaborate…" }[uiLang];
	const sendText = { fr: "Envoyer", en: "Send" }[uiLang];

	const desc = thumbs === "up" ? descUp : descDown;

	const renderContent = close => {
		if (isSent) {
			return <Title>{thanks}</Title>;
		}

		return (
			<>
				<Title>{title}</Title>

				<div>
					<ThumbsIcon src={imgThumbsUp} alt={altUp} onClick={thumbsUpHandler} selected={thumbs === "up"} up />
					<ThumbsIcon src={imgThumbsDown} alt={altDown} onClick={thumbsDownHandler} selected={thumbs === "down"} down />
				</div>

				{thumbs && (
					<>
						<ThumbsDesc>{desc}</ThumbsDesc>
						<textarea
							style={{ marginTop: 20, width: "100%" }} // Unable to use useRef on a styled component...
							rows="3"
							ref={textareaRef}
							placeholder={placeholder}
						></textarea>

						<StyledButton active onClick={() => sendHandler(close)} label={sendText} />
					</>
				)}

				<Footer>
					<a href="https://github.com/adblockradio/webplayor" target="_blank" rel="noopener noreferrer">
						{contrib}
					</a>
				</Footer>
			</>
		);
	};

	return (
		<Popup condensed={condensed} trigger={trigger}>
			{close => renderContent(close)}
		</Popup>
	);
}

Popup.defaults = {
	condensed: false
};

PopupFeedback.propTypes = {
	condensed: PropTypes.bool,
	uiLang: PropTypes.string.isRequired,
	onSend: PropTypes.func.isRequired,
	trigger: PropTypes.oneOfType([PropTypes.func, PropTypes.element]).isRequired
};

export default PopupFeedback;
