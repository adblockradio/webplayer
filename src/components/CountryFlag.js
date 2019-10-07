import React, { Component } from "react";
import PropTypes from "prop-types";
//import consts from "../consts.js";
import styled from "styled-components";
import classNames from "classnames";


// when adding a country here, also add it in ../consts.js

import frFlag from "../img/flags/fr.png";
import ukFlag from "../img/flags/uk.png";
import beFlag from "../img/flags/be.png";
import deFlag from "../img/flags/de.png";
import spFlag from "../img/flags/sp.png";
import swFlag from "../img/flags/sw.png";
import itFlag from "../img/flags/it.png";
import nlFlag from "../img/flags/Netherlands.svg";
import usFlag from "../img/flags/United States of America.svg";
import skFlag from "../img/flags/Slovakia.svg";
import nzFlag from "../img/flags/New Zealand.svg";
import caFlag from "../img/flags/Canada.svg";
import fiFlag from "../img/flags/Finland.svg";
import agFlag from "../img/flags/Argentina.svg";
import urFlag from "../img/flags/Uruguay.svg";
import grFlag from "../img/flags/Greece.svg";

var flags = {
	fr: frFlag, "France": frFlag,
	en: ukFlag, "United Kingdom": ukFlag,
	be: beFlag, "Belgium": beFlag,
	sp: spFlag, "Spain": spFlag,
	sw: swFlag, "Switzerland": swFlag,
	it: itFlag, "Italy": itFlag,
	de: deFlag, "Germany": deFlag,
	nl: nlFlag, "Netherlands": nlFlag,
	us: usFlag, "United States of America": usFlag,
	sk: skFlag, "Slovakia": skFlag,
	nz: nzFlag, "New Zealand": nzFlag,
	ca: caFlag, "Canada": caFlag,
	fi: fiFlag, "Finland": fiFlag,
	ag: agFlag, "Argentina": agFlag,
	ur: urFlag, "Uruguay": urFlag,
	gr: grFlag, "Greece": grFlag,
};


const FlagBox = styled.div`
	border-radius: 5px;
	display: inline-block;
	margin: 5px;
	&.selected {
		margin: 2px;
		border: #ef66b0 3px solid;
	}
	&.clickable {
		cursor: pointer;
	}
`;

const Flag = styled.img`
	/*width: 64px;
	height: 48px;*/
	margin: 5px;
	border-radius: 5px;
	border: 0px;

`;

class FlagContainer extends Component {
	render() {
		return (
			<FlagBox className={classNames({ selected: this.props.selected, clickable: this.props.onClick })} onClick={this.props.onClick}>
				<Flag src={flags[this.props.country]} style={{width: this.props.width || 64, height: this.props.height || 48}}></Flag>
			</FlagBox>
		);
	}
}

FlagContainer.propTypes = {
	country: PropTypes.string.isRequired,
	selected: PropTypes.bool.isRequired,
	onClick: PropTypes.func,
	height: PropTypes.number,
	width: PropTypes.number
};

export default FlagContainer;
