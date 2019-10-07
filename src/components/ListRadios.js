import React, { Component } from "react";
import PropTypes from "prop-types";
import consts from "../consts.js";
import CountryFlag from "./CountryFlag.js";
import classNames from "classnames";
import styled from "styled-components";
import removeIcon from "../img/remove.png";

const ResultOuterContainer = styled.div`
	display: inline-block;
	width: 150px;
	padding: 5px;
	vertical-align: top;
	&.condensed {
		width: 90px;
	}
`;

const ResultInnerContainer = styled.div`
	margin: 5px 0 5px 0;
	text-align: center;
	padding: 10px;
	border-radius: 10px;
	width: 100%;
	display: inline-block;
	border: 2px solid white;
	cursor: pointer;
	&:hover {
		border: #ef66b0 2px solid;
	}
	&.selected {
		border: #ef66b0 2px solid;
		box-shadow: inset 0px 0px 5px #ef66b0;
	}
	&.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
`;

const RadioLogoContainer = styled.div`
	width: 116px;
	height: 116px;
	position: relative;
	&.condensed {
		width: 56px;
		height: 56px;
	}
`;

const RadioLogo = styled.img`
	width: 100%;
	position: absolute;
	top: 50%;
    left:50%;
	margin-top: -50%;
	margin-left: -50%;
`;

const RadioLabel = styled.div`
	margin-top: 0.5em;
	font-size: 18px;
	&.condensed {
		font-size: 14px;
	}
`;

class Result extends Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		this.props.onClick(this.props.name);
	}

	render() {
		return (
			<ResultOuterContainer className={classNames({ condensed: this.props.condensed })}>
				<ResultInnerContainer className={classNames({ selected: this.props.selected, disabled: this.props.disabled })} onClick={this.handleClick}>
					<RadioLogoContainer className={classNames({ condensed: this.props.condensed })}>
						<RadioLogo src={this.props.logo || "https://static.adblockradio.com/assets/default_radio_logo.png"} alt={this.props.name} />
					</RadioLogoContainer>
					<RadioLabel className={classNames({ condensed: this.props.condensed })}>{this.props.name}</RadioLabel>
				</ResultInnerContainer>
			</ResultOuterContainer>
		);
	}
}
// className="col-xs-6 col-sm-3 col-md-2"
//				<button type="button" className="btn btn-default addRadioButton searchCommand" onClick={this.handleClick}>Ajouter</button>

Result.propTypes = {
	logo: PropTypes.string,
	name: PropTypes.string.isRequired,
	selected: PropTypes.bool,
	onClick: PropTypes.func.isRequired,
	disabled: PropTypes.bool.isRequired,
	condensed: PropTypes.bool.isRequired
};

const RemoveIcon = styled.img`
	width: 24px;
	height: 24px;
	vertical-align: middle;
	margin-left: 10px;
`;

const PlaylistItemContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
`;

const PlaylistItemTitle = styled.span`
/*	flex-grow: 1;*/
`;

class PlaylistItem extends Component {
	render() {
		return <PlaylistItemContainer>
			<CountryFlag
				country={this.props.country} width={24} height={16}
				selected={false}
				onClick={null} />
			<PlaylistItemTitle>{this.props.name}</PlaylistItemTitle>
			<RemoveIcon src={removeIcon} onClick={this.props.onClick} />
		</PlaylistItemContainer>;
	}
}

PlaylistItem.propTypes = {
	country: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired
};

const Title = styled.p`
	font-size: 36px;
	&.condensed {
		font-size: 26px;
	}
`;

const SubTitle = styled.p`
	font-size: 18px;
	&.condensed {
		font-size: 13px;
	}
`;

const Input = styled.input`
	margin: 10px 0px;
`;

const PlaylistContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
`;

class ListRadios extends Component {
	constructor(props) {
		super(props);
		this.SEARCH_REMOVE = 1000;
		this.SEARCH_ADD = 1001;
		this.SEARCH_SELECT = 1002;
		this.state = {
			searchText: "",
			searchCountry: consts.COUNTRIES[0]
		}; //results: props.catalog
		this.handleAdd = this.handleAdd.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.inputChange = this.inputChange.bind(this);
		this.handleResultClick = this.handleResultClick.bind(this);
		this.handleFlagClick = this.handleFlagClick.bind(this);

	}

	handleAdd() {
		//let self = this;
		this.setState({ status: this.SEARCH_SELECT });
		/*self.props.bsw.getSupportedRadios(function(supportedRadios) {
			console.log("supported radios are " + supportedRadios);
			self.setState({ supportedRadios: supportedRadios });
		});*/
	}

	handleClose() {
		this.setState({ status: this.SEARCH_ADD });
	}

	handleResultClick(radio) {
		let results = this.pickRadios(); //this.state.results.length > 0 ? this.state.results : this.props.catalog;
		for (let i=0; i<results.length; i++) {
			//console.log(radio.name + "_" + radio.country);
			if (results[i].name === radio.name && results[i].country === radio.country) {
				console.log("click radio index:" + i);
				if (this.props.settings.findRadioByName(results[i].name) >= 0) {
					this.props.bsw.removeRadio(radio.name);
				} else {
					this.props.bsw.addRadio(radio);
				}
				break;
			}
		}
		this.forceUpdate();
		console.log("result click " + radio.name);
	}

	handleFlagClick(country) {
		let targetSearchCountry = country; //this.state.searchCountry === country ? null : country;
		console.log("target search country = " + targetSearchCountry);
		this.setState({ "searchCountry": targetSearchCountry });//, this.updateFilter);
	}

	inputChange(evt) {
		let valueRef = evt.target.value;
		//console.log("enter:" + valueRef + " vs " + this.state.value);
		this.setState({ "searchText": valueRef }); //, this.updateFilter);
	}

	updateCatalogEntry(country, name, result) {
		for (let k=0; k<this.props.catalog.length; k++) {
			if (this.props.catalog[k].country === country && this.props.catalog[k].name === name) {
				Object.assign(this.props.catalog[k], {
					url: result.url,
					homepage: result.homepage,
					logo: result.favicon,
					votes: result.votes,
					codec: result.codec,
					hls: result.hls
				});
			}
			return;
		}
		console.log("updateCatalogEntry: warn: could not find catalog entry to update");
	}

	pickRadios() {
		//console.log("pickRadios: props.catalog.length=" + this.props.catalog.length);
		let partialCatalog = [];
		var self = this;
		var metadataUpdateCallback = function(result) {
			if (result) {
				//console.log("pickRadios: force update");
				self.forceUpdate();
			}
		};

		for (let i=0; i<this.props.catalog.length; i++) {
			//console.log(require("util").inspect(this.props.settings.catalog[i], { depth: null }));
			//console.log("norm catalog: " + consts.normStr(this.props.catalog[i].name) + " vs " + consts.normStr(valueRef));
			if (this.state.searchText && consts.normStr(this.props.catalog[i].name).indexOf(consts.normStr(this.state.searchText)) < 0) {
				//console.log("pickRadios:" + this.props.catalog[i].name + " does not contain text " + this.state.searchText);
				continue;
			} else if (this.state.searchCountry && this.props.catalog[i].country !== this.state.searchCountry) {
				//console.log("pickRadios:" + this.props.catalog[i].country + "_" + this.props.catalog[i].name + " has not country " + this.state.searchCountry);
				continue;
			} else {
				partialCatalog.push(this.props.catalog[i]);
				// if metadata is missing, fetch it
				if (!this.props.catalog[i].logo || !this.props.catalog[i].url) {
					this.props.bsw.getRadio(this.props.catalog[i].country, this.props.catalog[i].name, metadataUpdateCallback);
				}
			}
		}
		//this.setState({ "results": partialCatalog });
		return partialCatalog;
	}

	render() {
		const self = this;
		let state = this.state;
		let results = this.pickRadios(); //state.results; //state.results.length > 0 ? state.results : this.props.catalog;
		let selected = this.props.settings.radios.length; //0;
		let displayed = 0;
		for (let i=0; i<results.length; i++) {
			results[i].alreadyInPlaylist = this.props.settings.findRadioByName(results[i].name) >= 0;
			displayed += !results[i].alreadyInPlaylist;
		}

		let handleResultClick = this.handleResultClick;
		let handleFlagClick = this.handleFlagClick;
		let playlistFull = selected >= this.props.settings.mpll;
		let condensed = this.props.condensed;
		let lang = this.props.settings.config.uiLang;
		//let title = {fr:"Je choisis ",en:"I choose "}[lang] + (this.props.catalog.length > this.props.settings.mpll ? ({fr:"jusqu'à ",en:"up to "}[lang] + this.props.settings.mpll) : {fr:"des",en:""}[lang]) + {fr:" radios pour ma playlist",en:" radios for my playlist"}[lang];
		let title = {fr: "Je choisis mes radios préférées", en: "I choose my favorite radios"}[lang];
		const subtitle = {fr: "Ce lecteur de démonstration propose une sélection de radios.", en: "This is a demo player that features a subset of all compatible radios."}[lang];
		const subtitle2 = {fr: "Pour découvrir l'ensemble des radios et lecteurs disponibles, ", en: "To discover all available radios and players, "}[lang];

		const subtitleClick = {fr: "cliquez ici", en: "click here"}[lang];
		//console.log("search results to display: " + results.length);
		let removeRadio = this.props.bsw.removeRadio;



		return (
			<div style={{ margin: "auto", width: condensed ? "auto" : "80%"}}>
				<Title>{title}</Title>
				<SubTitle>{subtitle}</SubTitle>
				<SubTitle>{subtitle2}<a target="_blank" rel="noopener noreferrer" href="https://github.com/adblockradio/available-models">{subtitleClick}.</a></SubTitle>

				<PlaylistContainer>
					{this.props.settings.radios.map(function(radio, i) {
						return <PlaylistItem key={i} country={radio.country} name={radio.name} onClick={function() { removeRadio(radio.country + "_" + radio.name); }} />;
					})}
				</PlaylistContainer>

				<Input type="text" className="form-control" placeholder={{fr:"Filtrer par nom de radio…",en:"Filter by radio name…"}[lang]} id="searchField" value={this.state.searchText} onChange={this.inputChange} />

				<div>
					{consts.COUNTRIES.filter(function(c) {
						return self.props.catalog.filter(r => r.country === c).length > 0;
					}).map(function(country, i) {
						return <CountryFlag
							country={country} key={i} width={48} height={32}
							selected={state.searchCountry === country}
							onClick={function() { handleFlagClick(country); }} />;
					})}
				</div>

				{playlistFull && <p style={{margin: "2em"}}>{{fr:"Votre playlist est pleine", en:"Your playlist is full"}[lang]}</p>}

				<div style={{ overflowY: "auto" }}>
					{displayed > 0 || playlistFull ?
						results.map(function(result, i) {
							return <Result logo={result.logo}
								name={result.name}
								selected={result.alreadyInPlaylist}
								disabled={!result.alreadyInPlaylist && playlistFull}
								condensed={condensed}
								onClick={function() { handleResultClick(result); }} key={"result" + i} />;
						})
						:
						<p style={{margin: "2em"}}>{{fr:"Il n'y a plus de radios à ajouter", en:"There are no radios anymore to add"}[lang]}</p>
					}
				</div>
			</div>
		);
	}
}
/*{this.props.settings.mpll > 0 &&
	<p>Vous en avez sélectionné {selected}. {selected > this.props.settings.mpll ? "Il faut en enlever&nbsp;!" : ""}</p>
}*/
ListRadios.propTypes = {
	settings: PropTypes.object.isRequired,
	bsw: PropTypes.object.isRequired,
	catalog: PropTypes.array.isRequired,
	condensed: PropTypes.bool.isRequired
};

export default ListRadios;
