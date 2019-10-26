import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Popup from "./Layout/Popup.js";
import Button from "./Controls/Button";
import T from "./T";

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

const SuccessIcon = styled.img`
	width: 96px;
	height: 96px;
	margin: 0 auto 30px;
`;

function PopupFeedback(props) {
	const { onSend, trigger } = props;

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

	const desc = thumbs === "up" ? <T str="popup.feedback.desc.up" /> : <T str="popup.feedback.desc.down" />;

	const renderContent = close => {
		if (isSent) {
			return (
				<>
					<SuccessIcon src={imgOk} />
					<Title>
						<T str="popup.feedback.thanks" />
					</Title>
				</>
			);
		}

		return (
			<>
				<Title>
					<T str="popup.feedback.title" />
				</Title>

				<div>
					<T str="popup.feedback.alt.up">
						{value => (
							<ThumbsIcon src={imgThumbsUp} alt={value} onClick={thumbsUpHandler} selected={thumbs === "up"} up />
						)}
					</T>
					<T str="popup.feedback.alt.down">
						{value => (
							<ThumbsIcon
								src={imgThumbsDown}
								alt={value}
								onClick={thumbsDownHandler}
								selected={thumbs === "down"}
								down
							/>
						)}
					</T>
				</div>

				{thumbs && (
					<>
						<ThumbsDesc>{desc}</ThumbsDesc>

						<T str="popup.feedback.placeholder">
							{value => (
								<textarea
									style={{ marginTop: 20, width: "100%" }} // Unable to use useRef on a styled component...
									rows="3"
									ref={textareaRef}
									placeholder={value}
								></textarea>
							)}
						</T>

						<StyledButton active onClick={() => sendHandler(close)} label={<T str="popup.feedback.send" />} />
					</>
				)}

				<Footer>
					<a href="https://github.com/adblockradio/webplayer" target="_blank" rel="noopener noreferrer">
						<T str="popup.feedback.contrib" />
					</a>
				</Footer>
			</>
		);
	};

	return <Popup trigger={trigger}>{renderContent}</Popup>;
}

PopupFeedback.propTypes = {
	onSend: PropTypes.func.isRequired,
	trigger: PropTypes.oneOfType([PropTypes.func, PropTypes.element]).isRequired
};

export default PopupFeedback;
