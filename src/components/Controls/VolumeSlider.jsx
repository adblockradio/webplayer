import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import classNames from "classnames";

import "rc-slider/assets/index.css";
import "rc-tooltip/assets/bootstrap.css";
//import Tooltip from "rc-tooltip"; // https://github.com/react-component/slider
import Slider from "rc-slider"; // https://react-component.github.io/slider/

import muteIcon from "../../img/mute_52324.svg";
import speakerIcon from "../../img/sound.svg";

const VolumeWrapper = styled.div`
	width: 200px;
	background: #eee;
	padding: 5px 10px;
	border-radius: 30px;
	display: inline-flex;
	z-index: 800;
	vertical-align: middle;
	margin: 8px 15px 8px 15px;

	&.condensed {
		left: 50%;
		width: 180px;
		margin-left: -90px;
	}
`;

const VolumeSliderStyle = {
	height: "15px",
	margin: "10px"
};

const ControlIcon = styled.img`
	height: 20px;
	margin: 7px;
	cursor: pointer;
`;


class VolumeSlider extends Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.mute = this.mute.bind(this);
		this.fullVolume = this.fullVolume.bind(this);
		//this.handleChangeComplete = this.handleChangeComplete.bind(this);
	}

	handleChange(value) {
		console.log("Controls: volume=" + value + "%");
		this.props.bsw.volume.save(value/100.0);
	}

	mute() {
		console.log("Controls: mute");
		this.props.bsw.volume.save(0);
		this.forceUpdate();
	}

	fullVolume() {
		console.log("Controls: full volume");
		this.props.bsw.volume.save(1);
		this.forceUpdate();
	}

	render() {
		return (
			<VolumeWrapper className={classNames({ condensed: this.props.condensed })}>
				<ControlIcon src={muteIcon} onClick={this.mute} />
				<Slider min={0} max={100} value={this.props.config.userVolume*100}
					onChange={this.handleChange} style={VolumeSliderStyle} />
				<ControlIcon src={speakerIcon} onClick={this.fullVolume} />
			</VolumeWrapper>
		);
	}
}

VolumeSlider.propTypes = {
	bsw: PropTypes.object.isRequired,
	config: PropTypes.object.isRequired,
	condensed: PropTypes.bool.isRequired,
};

export default VolumeSlider;