import React, { Component } from "react";
import VolumeSlider from "./VolumeSlider";
import PlayerStatus from "./PlayerStatus";
import PropTypes from "prop-types";
import styled from "styled-components";


const DivControls = styled.div`
	margin: -60px 0 0 0px;
	z-index: 1000;
	top: 100%;
	position: relative;
	background: #eee;
	height: 60px;
	align-items: center;
	display: flex;
	border-top: 2px solid #888;
`;

class Controls extends Component {
	constructor(props) {
		super(props);
		this.togglePlayer = this.togglePlayer.bind(this);
	}

	togglePlayer() {
		console.log("toggle player");
		this.props.bsw.togglePlay();
	}

	render() {
		return (
			<DivControls>
				<PlayerStatus settings={this.props.settings} bsw={this.props.bsw} condensed={this.props.condensed} playbackAction={this.togglePlayer} />

				{!this.props.condensed &&
					<VolumeSlider config={this.props.settings.config} bsw={this.props.bsw} condensed={this.props.condensed} />
				}
			</DivControls>
		);
	}
}

Controls.propTypes = {
	bsw: PropTypes.object.isRequired,
	settings: PropTypes.object.isRequired,
	condensed: PropTypes.bool.isRequired,
	isPlaying: PropTypes.bool.isRequired
};

export default Controls;
