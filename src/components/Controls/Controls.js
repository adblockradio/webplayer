import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Volume from "./Volume";
import PlayerStatus from "./PlayerStatus";
import PlayPause from "./PlayPause";

import { useBreakpoint } from "../../helpers/hooks";

import consts from "../../consts.js";

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
	const { bsw, settings } = props;

	const isDesktop = useBreakpoint("l");

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
			<PlayerStatus radio={indexRadio} reducedVolume={reducedVolume} settings={settings} />
			{isDesktop && <Volume volume={settings.config.userVolume} onChange={handleVolumeChange} />}
		</StyledControls>
	);
}

Controls.propTypes = {
	bsw: PropTypes.object.isRequired,
	settings: PropTypes.object.isRequired
};

export default Controls;
