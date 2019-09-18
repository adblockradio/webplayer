import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Slider from "rc-slider";

import "rc-slider/assets/index.css";
import "rc-tooltip/assets/bootstrap.css";

import muteIcon from "../../img/mute_52324.svg";
import speakerIcon from "../../img/sound.svg";

const StyledVolume = styled.div`
  width: 200px;
  display: inline-flex;
  margin-left: auto;
  margin-right: 25px;
`;

const StyledIcon = styled.img`
  height: 20px;
  margin: 7px;
  cursor: pointer;
`;

const sliderStyle = {
	height: "15px",
	margin: "10px"
};

function VolumeControl(props) {
	const { onChange, volume } = props;

	const handleSliderChange = value => {
		onChange(value / 100);
	};

	const handleMute = () => {
		onChange(0);
	};

	const handleFull = () => {
		onChange(1);
	};

	return (
		<StyledVolume>
			<StyledIcon src={muteIcon} onClick={handleMute} />
			<Slider min={0} max={100} value={volume * 100} onChange={handleSliderChange} style={sliderStyle} />
			<StyledIcon src={speakerIcon} onClick={handleFull} />
		</StyledVolume>
	);
}

VolumeControl.propTypes = {
	volume: PropTypes.number.isRequired,
	onChange: PropTypes.func.isRequired
};

export default React.memo(VolumeControl, (prev, next) => {
	// only `volume` can rerender this component. We know that other props will never change.
	return prev.volume === next.volume;
});
