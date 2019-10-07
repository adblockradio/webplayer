import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import styled from "styled-components";


const FeedbackContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	background: rgba(128, 128, 128, 0.5);
	z-index: 2000;
`;

const FeedbackBox = styled.div`
	background: white;
	padding: 2em;
	text-align: center;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: flex;
	flex-direction: column;
	border-radius: 2em;
	position: absolute;

	&.condensed {
		padding: 0em 1em 0.5em 1em;
		border-radius: 1em;
	}
`;

/* const FeedbackIcons = styled.div`
	display: flex;
	flex-direction: row;
	margin: auto;
`;

const FeedbackTextStyle = {
	marginTop: "1em",
	width: "100%"
}; */

const FeedbackCloseContainer = styled.div`
	text-align: right;
	margin-top: 10px;
	margin-bottom: -2em;
`;

const FeedbackIcon = styled.img`
	width: 96px;
	height: 96px;
	margin: 2px auto;
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

/* const FeedbackSend = styled.div`
	background-color: #fe5c8e;
	border-radius: 15px;
	width: 200px;
	cursor: pointer;
	text-align: center;
	padding: 7px 0px;
	color: white;
	margin: 30px auto 0px auto;
`; */

const FeedbackClose = styled.span`
	font-size: 18px;
	border: 2px solid grey;
	padding: 2px;
	border-radius: 30%;
	margin-bottom: 1em;
	color: grey;
	cursor: pointer;
`;

class Popup extends Component {
	render() {
		const contents = this.props.contents;
		return (
			<FeedbackContainer>
				<FeedbackBox className={classNames({ condensed: this.props.condensed })}>
					{!!this.props.closeCallback &&
						<FeedbackCloseContainer onClick={this.props.closeCallback}>
							<FeedbackClose className="glyphicon glyphicon glyphicon-remove" style={{}}></FeedbackClose>
						</FeedbackCloseContainer>
					}
					{!!this.props.icon &&
						<FeedbackIcon src={this.props.icon} alt={this.props.iconAlt} />
					}
					{contents}
				</FeedbackBox>
			</FeedbackContainer>
		);
	}
}

Popup.propTypes = {
	contents: PropTypes.object.isRequired,
	closeCallback: PropTypes.func,
	icon: PropTypes.string,
	iconAlt: PropTypes.string,
	condensed: PropTypes.bool.isRequired,
};

export default Popup;
