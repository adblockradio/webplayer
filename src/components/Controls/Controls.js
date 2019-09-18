import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import consts from "../../consts.js";

import Volume from "./Volume";
import PlayerStatus from "./PlayerStatus";
import PlayPause from "./PlayPause";

const StyledControls = styled.div`
  display: flex;
  position: relative;
  top: 100%;
  height: 60px;
  margin: -60px 0 0 0px;
  z-index: 1000;
  background: #eee;
  align-items: center;
  border-top: 2px solid #888;
`;

function Controls(props) {
	const { condensed, bsw, settings } = props;

	const togglePlayer = () => {
		bsw.togglePlay();
	};

	const handleVolumeChange = volume => {
		bsw.volume.save(volume);
	};

	const indexRadio = bsw.getActiveIndex();
	const reducedVolume = settings.config.filterVolume === consts.VOLUME_MUTED;

	return (
		<StyledControls>
			<PlayPause playing={!isNaN(indexRadio)} onToggle={togglePlayer} />
			<PlayerStatus radio={indexRadio} reducedVolume={reducedVolume} condensed={condensed} settings={settings} />
			{!condensed && <Volume volume={settings.config.userVolume} onChange={handleVolumeChange} />}
		</StyledControls>
	);
}

Controls.propTypes = {
	condensed: PropTypes.bool.isRequired,
	bsw: PropTypes.object.isRequired,
	settings: PropTypes.object.isRequired
};

export default Controls;
