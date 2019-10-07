import React, { Component } from "react";
import PropTypes from "prop-types";
//import classNames from "classnames";
//import styled from "styled-components";

import music from "../img/type/1music.png";
import speech from "../img/type/2speech.png";
import ads from "../img/type/3ads.png";
import consts from "../consts.js";

/*const TdIcons = styled.td`
	padding: 1em;
	text-align: center;
`;*/

class FilterContentIcons extends Component {
	render() {
		//let glyphPl = <span className="glyphicon glyphicon-plus glyphStyle" aria-hidden="true"></span>;
		let logoMusic = <img className="img-circle choice-icon" src={music} alt="music" />;
		let logoTalk = <img className="img-circle choice-icon" src={speech} alt="speech" />;
		let logoAds = <img className="img-circle choice-icon" src={ads} alt="ads" />;
		let glyphOk = <span className="glyphicon glyphicon-ok glyphStyle" aria-hidden="true" style={{"color": "green"}}></span>;
		let glyphRm = <span className="glyphicon glyphicon-remove glyphStyle" aria-hidden="true" style={{"color": "orange"}}></span>;


		return (
			<span>
				{logoMusic}
				{glyphOk}&nbsp;
				{logoTalk}
				{(this.props.cat === consts.FILTER_SPEECH || this.props.cat === consts.FILTER_OFF) &&
					glyphOk
				}
				{this.props.cat === consts.FILTER_MUSIC &&
					glyphRm
				}
				&nbsp;
				{logoAds}
				{this.props.cat === consts.FILTER_OFF &&
					glyphOk
				}
				{(this.props.cat === consts.FILTER_MUSIC || this.props.cat === consts.FILTER_SPEECH) &&
					glyphRm
				}
			</span>
		);
	}
}

/*




*/


FilterContentIcons.propTypes = {
	cat: PropTypes.number.isRequired
};

export default FilterContentIcons;
