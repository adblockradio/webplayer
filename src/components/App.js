import React, { Component } from "react";
import styled from "styled-components";
import classNames from "classnames";

import RadiosCarousel from "./RadiosCarousel.js";
import Splashscreen from "./Layout/Splashscreen";
import MediaElement from "./MediaElement.js";
import Onboarding from "./Onboarding/Onboarding.jsx";
import Menu from "./Menu";

import { LocaleContext } from "../LocaleContext";

import Settings from "../Settings.js";
import consts from "../consts.js";

const Root = styled.div`
	overflow: auto;
	display: flex;
	flex-wrap: nowrap;
	height: 100%;
`;

const RightUI = styled.div`
	flex-grow: 1;
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
			mobile: false
		};

		this.mediaQueryChanged = this.mediaQueryChanged.bind(this);

		this.showOnboarding = this.showOnboarding.bind(this);
		this.closeOnboarding = this.closeOnboarding.bind(this);
	}

	componentDidMount() {
		let mql = window.matchMedia("(max-width: 1000px)");
		mql.addListener(this.mediaQueryChanged);

		this.state.settings.loadSettings();
		let status = this.state.settings.accountStatus();
		this.setState({
			mql: mql,
			mobile: mql.matches,
			onboarding:
				this.state.settings.radios.length === 0 || status === consts.UI_NEED_EMAIL || status === consts.UI_WAIT_CONFIRM
		});

		this.bsw = require("../background.js").default(this.state.settings, this.updateUI);
		let self = this;
		this.bsw.getServerList(function() {
			self.bsw.getRadioList(function() {
				self.bsw.getSupportedRadios(function() {
					self.setState({ loading: false, settings: self.state.settings });
				});
			});
		});
	}

	componentWillUnmount() {
		this.state.mql.removeListener(this.mediaQueryChanged);
	}

	mediaQueryChanged() {
		this.setState({ mobile: this.state.mql.matches });
	}

	toggleOnboarding(show) {
		let status = this.state.settings.accountStatus();
		if (status === consts.UI_NEED_EMAIL || status === consts.UI_WAIT_CONFIRM) {
			this.setState({ onboarding: true });
			return true;
		} else {
			this.setState({ onboarding: show || !this.state.onboarding });
			return false;
		}
	}

	showOnboarding() {
		this.toggleOnboarding(true);
	}
	closeOnboarding() {
		this.toggleOnboarding(false);
	}

	render() {
		let settings = this.state.settings;

		if (this.state.loading) {
			return <Splashscreen condensed={this.state.mobile} />;
		}

		let status = this.state.settings.accountStatus();
		let onboarding = this.state.onboarding || status === consts.UI_NEED_EMAIL || status === consts.UI_WAIT_CONFIRM;
		return (

			<LocaleContext.Provider value={settings.config.uiLang}>
				<Root>
					{!(onboarding && this.state.mobile) && (
						<Menu
							bsw={this.bsw}
							filterType={settings.config.filterType}
							actionType={settings.config.actionType}
							showOnboarding={this.showOnboarding}
							showFeedback={this.showFeedback}
							showFlag={this.showFlag}
						/>
					)}
					<RightUI className={classNames({ condensed: this.state.mobile })} style={{ height: window.innerHeight }}>
						{onboarding ? (
							<Onboarding
								bsw={this.bsw}
								settings={settings}
								closeOnboarding={this.closeOnboarding}
								catalog={settings.catalog}
								condensed={this.state.mobile}
							/>
						) : (
							<RadiosCarousel bsw={this.bsw} settings={settings} condensed={this.state.mobile} />
						)}
						<div style={{ display: "none" }}>
							<MediaElement
								id="player1"
								width={0}
								height={0}
								url={this.state.settings.player.url}
								volume={this.state.settings.player.volume}
								options={"{}"}
								onError={this.bsw.onPlayerError}
								onPause={this.bsw.stopPlayInBackground}
							/>
						</div>
					</RightUI>
				</Root>
			</LocaleContext.Provider>
		);
	}
}

export default App;
