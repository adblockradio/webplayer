import React, { Component } from "react";
import Settings from "../Settings.js";
import Onboarding from "./Onboarding/Onboarding.jsx";
import FilteringChoice from "../components/FilteringChoice.js";
import RadiosCarousel from "../components/RadiosCarousel.js";
import styled from "styled-components";
import consts from "../consts.js";
import classNames from "classnames";
import MediaElement from "./MediaElement.js";

const Root = styled.div`
	overflow: auto;
	display: flex;
	flex-wrap: nowrap;
`;

const RightUI = styled.div`
	/*width: calc(100% - 20vw);*/
	/*float: right;*/
	/*height: 100vh;*/
	flex-grow: 1;

	/*&.condensed {
		width: calc(100% - 80px);
	}*/
`;

const Loading = styled.div`
	background: #98b3ff; /*linear-gradient(to bottom, #a4d7fe 0%, #98b3ff 100%);*/
	height: 100vh;
	width: 100%;
	display: flex;
	flex-direction: column;
`;

const LoadingLogo = styled.img`
	width: 380px;
	margin: auto;
	&.condensed {
		width: 190px;
	}
`;

class App extends Component {
	constructor(props) {
		super(props);

		let self = this;
		this.updateUI = function(type) {
			if (type === "predictions") {
				self.setState({ settings: self.state.settings });
			} else {
				self.forceUpdate();
			}
		};
		let settings = new Settings(this.updateUI);

		this.state = {
			loading: true,
			onboarding: false,
			settings: settings,
			//catalog: [],
			mobile: false//,
			//sources: []
		};

		this.showOnboarding = this.showOnboarding.bind(this);
		this.closeOnboarding = this.closeOnboarding.bind(this);
		this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
		//console.log(JSON.stringify(settings));
	}

	/*componentWillMount() {

	}*/

	componentDidMount() {
		let mql = window.matchMedia("(max-width: 1000px)");
		mql.addListener(this.mediaQueryChanged);

		this.state.settings.loadSettings();
		let status = this.state.settings.accountStatus();
		this.setState({ mql: mql, mobile: mql.matches, onboarding: this.state.settings.radios.length === 0 || status === consts.UI_NEED_EMAIL || status === consts.UI_WAIT_CONFIRM });


		this.bsw = require("../background.js").default(this.state.settings, this.updateUI);
		let self = this;
		this.bsw.getServerList(function() {
			self.bsw.getSupportedRadios(function() {
				//self.state.settings.mpll = mpll;
				self.setState({ "settings": self.state.settings }); //"catalog": catalog,

				// clean radios from playlist that would not be supported anymore
				//for (let i=self.state.settings.radios.length-1; i>=0; i--) {

				// TODO put where radio metadata is refreshed
				/* else {
					// update radio logo url
					if (self.state.settings.radios[i].logo !== catalog[indexRadio].favicon) {
						console.log("favicon update");
					}
					self.state.settings.radios[i].logo = catalog[indexRadio].favicon;
				}*/
				//}
				self.setState({ loading: false });
			});
		});

		//this.updateMediaUrl();
	}

	componentWillUnmount() {
		this.state.mql.removeListener(this.mediaQueryChanged);
	}

	mediaQueryChanged() {
		//console.log("mobile mode: " + this.state.mql.matches);
		this.setState({ mobile: this.state.mql.matches});
	}

	toggleOnboarding(show) {
		let status = this.state.settings.accountStatus();
		if (status === consts.UI_NEED_EMAIL || status === consts.UI_WAIT_CONFIRM) {
			this.setState({ "onboarding" : true });
			return true;
		} else {
			this.setState({ "onboarding" : show || !this.state.onboarding });
			return false;
		}
	}

	showOnboarding() {
		this.toggleOnboarding(true);
	}

	closeOnboarding() {
		this.toggleOnboarding(false);
	}

	/*updateMediaUrl(url, mimeType) {
		//this.setState({ sources: [{ src:"http://radiocapital-lh.akamaihd.net/i/RadioCapital_Live_1@196312/master.m3u8", type: "application/x-mpegURL" }]});

		this.bsw.getSourceUrl(url, mimeType, function(newUrl, newMimeType) {
			this.setState({ sources: [{ src: newUrl, type: newMimeType }]});
		});
	}*/

	render() {
		let bsw = this.bsw;
		let settings = this.state.settings;

		/*let status = this.state.settings.accountStatus();
		if (status === consts.UI_NEED_EMAIL || status === consts.UI_WAIT_CONFIRM) {
			this.setState({ "onboarding" : true });
		}*/

		if (this.state.loading) {
			return (
				<Loading>
					<LoadingLogo src="https://static.adblockradio.com/assets/abr_transparent_head.png" className={classNames({ condensed: this.state.mobile })} alt="Adblock Radio loading" />
				</Loading>
			);
		} else {

			let status = this.state.settings.accountStatus();
			let onboarding = this.state.onboarding || status === consts.UI_NEED_EMAIL || status === consts.UI_WAIT_CONFIRM;
			return (
				<Root>
					{!(onboarding && this.state.mobile) &&
						<FilteringChoice bsw={bsw} settings={settings} showOnboarding={this.showOnboarding} hideButtons={onboarding} condensed={this.state.mobile} />
					}
					<RightUI className={classNames({condensed: this.state.mobile})} style={{height: window.innerHeight}}>
						{onboarding ?
							<Onboarding bsw={bsw} settings={settings} closeOnboarding={this.closeOnboarding} catalog={settings.catalog} condensed={this.state.mobile} />
							:
							<RadiosCarousel bsw={bsw} settings={settings} condensed={this.state.mobile} />
						}
						<div style={{display: "none"}}>
							<MediaElement
								id="player1"
								width={0}
								height={0}
								url={this.state.settings.player.url}
								//type={this.state.settings.player.type}
								volume={this.state.settings.player.volume}
								options={"{}"}
								onError={this.bsw.onPlayerError}
								onPause={this.bsw.stopPlayInBackground}
							/>
						</div>
					</RightUI>
				</Root>
			);
		}
	}
}

export default App;
