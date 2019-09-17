import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledText = styled.span`
  font-size: 26px;

  &.condensed {
    font-size: 18px;
  }
`;

const noRadio = { fr: "Choisissez une radio à écouter", en: "Choose a radio to listen to" };
const noSound = { fr: " (volume réduit)", en: " (muted)" };

function PlayerStatus(props) {
  const { condensed, radio, reducedVolume, settings } = props;
  const lang = settings.config.uiLang;

  const text = isNaN(radio) ? noRadio[lang] : settings.radios[radio].name + (reducedVolume ? noSound[lang] : "");

  return <StyledText className={condensed && "condensed"}>{text}</StyledText>;
}

PlayerStatus.defaults = {
  reducedVolume: false
};

PlayerStatus.propTypes = {
  radio: PropTypes.number.isRequired,
  reducedVolume: PropTypes.bool,
  condensed: PropTypes.bool.isRequired,
  settings: PropTypes.object.isRequired
};

export default React.memo(PlayerStatus);
