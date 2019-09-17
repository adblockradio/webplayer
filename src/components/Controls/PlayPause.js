import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import play from "../../img/start_1279169.svg";
import stop from "../../img/stop_1279170.svg";

const StyledPlayPause = styled.img`
  height: 40px;
  margin: 0 10px;
  cursor: pointer;
`;

function PlayPause(props) {
  const { className, playing, onToggle } = props;

  const handleToggle = () => {
    onToggle();
  };

  return (
    <StyledPlayPause
      src={playing ? stop : play}
      alt={playing ? "Start" : "Stop"}
      onClick={handleToggle}
      className={className}
    />
  );
}

PlayPause.defaults = {
  className: null,
  playing: false
};

PlayPause.propTypes = {
  className: PropTypes.string,
  playing: PropTypes.bool,
  onToggle: PropTypes.func.isRequired
};

export default React.memo(PlayPause, (prev, next) => {
  // only `playing` can rerender this component. We know that other props will never change.
  return prev.playing === next.playing;
});
