import consts from "./consts.js";
import jwt from "jwt-decode";

class Config {
	constructor() {
		this.filterType = consts.FILTER_SPEECH;
		this.actionType = consts.ACTION_MUTE;
		this.userVolume = 1.0;
		this.filterVolume = 1.0;
		this.uiLang = consts.LANGS[0];
		this.radiosCountry = consts.COUNTRIES[0];
	}
}

class Account {
	constructor(email) {
		this.email = email || "undefined";
		this.apikey = "undefined";
		//this.apikeyActivated = false;
		this.token = "";
		//this.maxPlaylistLen = 0;
	}
}

class Radio {
	constructor(data) {
		this.logo = data.logo;
		this.name = data.name;
		this.url = data.url;
		this.country = data.country;
		this.codec = data.codec;
		this.hls = data.hls;
		this.status = []; //{ date: new Date(), status: consts.STATUS_NOT_AVAILABLE_TEMPORARY }];
		this.metadata = null;
		this.playing = false;
		this.unmaintained = false;
	}
}

Radio.prototype.addStatus = function(status, gain) {
	let now = new Date();
	this.status.push({ date: now, status: status, gain: gain });
	while (now - this.status[0].date > consts.STATUS_HISTORY_LENGTH*1000 + 5000) {
		this.status.splice(0, 1);
	}
};

Radio.prototype.getStatus = function() {
	if (this.status.length > 0) {
		return this.status[this.status.length-1].status;
	} else {
		return consts.STATUS_NOT_AVAILABLE_TEMPORARY;
	}
};

class Player {
	constructor() {
		this.url = ""; //data.url;
		//this.type = ""; //data.type;
		this.volume = 0.5;
		//this.instance = null;
	}
}

class Settings {

	constructor(updateUI) {
		this.config = new Config();
		this.account = new Account();
		this.player = new Player();
		this.radios = [];
		this.catalog = [];
		this.mpll = 0;
		this.updateUI = updateUI;
	}

}

Settings.prototype.findRadioByName = function(radioName) {
	var indexRadio = -1;
	for (let i=0; i<this.radios.length; i++) {
		if (this.radios[i].name === radioName || this.radios[i].country + "_" + this.radios[i].name === radioName) {
			indexRadio = i;
			break;
		}
	}
	return indexRadio;
};

Settings.prototype.saveSettings = function() {
	//console.log("save settings");

	// cookies are limited to 4096 bytes. remove status from radios array to save space
	var lightRadios = [];//this.radios;
	for (let i=0; i<this.radios.length; i++) {
		lightRadios.push({
			name: this.radios[i].name,
			logo: this.radios[i].logo,
			url: this.radios[i].url,
			country: this.radios[i].country,
			codec: this.radios[i].codec,
			hls: this.radios[i].hls
		});
	}

	localStorage.setItem("abr_account", JSON.stringify(this.account));
	localStorage.setItem("abr_config", JSON.stringify(this.config));
	localStorage.setItem("abr_radios", JSON.stringify(lightRadios));
};

Settings.prototype.loadSettings = function() {

	let settingsAccountStr = localStorage.getItem("abr_account");
	let settingsConfigStr = localStorage.getItem("abr_config");
	let settingsRadiosStr = localStorage.getItem("abr_radios");
	var res = {};
	try {
		res.account = JSON.parse(settingsAccountStr);
		res.config = JSON.parse(settingsConfigStr);
		res.radios = JSON.parse(settingsRadiosStr);
	} catch(e) {
		console.log("could not parse settings: " + e);
	}
	if (res && res.radios) {
		for (let i=0; i<res.radios.length; i++) { // successive addRadios are necessary, so that methods on radios are implemented.
			let r = res.radios[i];
			this.addRadio(r);
		}
	}
	if (res && res.config) this.config = res.config;
	if (res && res.account) this.account = res.account;
	this.updateUI();
};

Settings.prototype.setCatalog = function(list) {
	// add the items of list that are missing in catalog
	for (let i=0; i<list.length; i++) {
		var split = list[i].split("_");

		let indexRadio = NaN;
		for (let j=0; j<this.catalog.length; j++) {
			if (this.catalog[j].country === split[0] && this.catalog[j].name === split[1]) {
				indexRadio = j;
				break;
			}
		}
		if (isNaN(indexRadio)) {
			//console.log("remove " + self.state.settings.radios[i].name + " as it is not supported anymore");
			//self.state.settings.removeRadio(self.state.settings.radios[i].name);
			this.catalog.push({ country: split[0], name: split[1] });
		}
	}

	// remove items of catalog that are not in list
	for (let i=this.catalog.length-1; i >= 0; i--) {
		let indexRadio = list.indexOf(this.catalog[i].country + "_" + this.catalog[i].name);
		if (indexRadio < 0) {
			console.log("setCatalog: radio " + this.catalog[i].country + "_" + this.catalog[i].name + " not found in " + list);
			this.catalog.splice(i,1);
		}
	}
	this.saveSettings();
};

Settings.prototype.updateCatalogEntry = function(result) {
	for (let i=0; i<this.catalog.length; i++) {
		if (result.country === this.catalog[i].country && result.name === this.catalog[i].name) {
			Object.assign(this.catalog[i], {
				url: result.url,
				logo: result.favicon,
				codec: result.codec,
				hls: result.hls
			});
			return;
		}
	}
	console.log("updateCatalogEntry: warn: radio not found");
	this.saveSettings();
};

Settings.prototype.addRadio = function(data) { // name, logo, url, country, codec, hls
	if (!data) return;

	// check that all props are here and rudimentary sanitization of the contents
	if (!data.url || data.url.indexOf("<") >= 0) return console.log("addRadio: invalid radio url. skip");
	if (!data.logo || data.logo.indexOf("<") >= 0) return console.log("addRadio: invalid radio logo: " + data.logo + ".skip");
	if (!data.name || data.name.indexOf("<") >= 0) return console.log("addRadio: invalid radio name. skip");
	if (!data.country || data.country.indexOf("<") >= 0) return console.log("addRadio: invalid radio country. skip");
	if (!data.codec || data.codec.indexOf("<") >= 0) return console.log("addRadio: invalid radio codec. skip");
	if (!isFinite(data.hls)) return console.log("addRadio: invalid radio hls. skip");

	// preventing errors such as
	// Blocked loading mixed active content “http://985-lh.akamaihd.net/i/studioaudio_1@393647/master.m3u8”
	if (data.url.slice(0, 5) === "http:" && data.url.slice(-5) === ".m3u8") {
		console.log(data.name + " force HTTPS for M3U8");
		data.url = "https:" + data.url.slice(5);
	}

	// enforce HTTPS for logos
	if (data.logo.slice(0, 5) === "http:") {
		console.log(data.name + " force HTTPS for logo: " + data.logo);
		data.logo = "https:" + data.logo.slice(5);
	}

	var indexRadio = this.findRadioByName(data.country + "_" + data.name);
	var radioWasNotInPlaylist;
	if (indexRadio < 0) { // not found
		if (this.mpll > 0 && this.radios.length >= this.mpll) {
			console.log("addRadio: maximum amount of radios reached " + this.account.maxPlaylistLen);
			return false;
		}

		this.radios.push(new Radio(data));
		if (this.config.maxPlaylistLen >= 0 && this.radios.length > this.config.maxPlaylistLen) {
			this.radios.splice(0, this.radios.length - this.config.maxPlaylistLen);
		}
		indexRadio = this.findRadioByName(data.country + "_" + data.name);
		console.log("addRadio: " + data.name + " has been inserted in playlist");
		radioWasNotInPlaylist = true;
	} else {
		Object.assign(this.radios[indexRadio], {
			logo: data.logo,
			url: data.url,
			country: data.country,
			codec: data.codec,
			hls: data.hls
		});
		console.log("addRadio: updated metadata about " + data.name);
		radioWasNotInPlaylist = false;
	}
	this.saveSettings();
	this.updateUI();

	let self = this;
	consts.getStreamUrlMime(this.radios[indexRadio].url.replace("http://", "https://"), function(newUrl) {
		if (self.radios[indexRadio].url !== newUrl) {
			console.log("stream url has been updated to " + newUrl);
			self.radios[indexRadio].url = newUrl;
			self.saveSettings();
		}/* else {
			console.log("radio added");
		}*/
	});

	return radioWasNotInPlaylist;
};

Settings.prototype.removeRadio = function(radioName) {
	console.log("background remove radio " + radioName);
	const indexRadio = this.findRadioByName(radioName);
	if (indexRadio >= 0) {
		this.radios.splice(indexRadio, 1);
		this.saveSettings();
	} else {
		console.log("radio " + radioName + " not found");
	}
	this.updateUI();
	return indexRadio;
};

Settings.prototype.getUnmaintainedRadioList = function() {
	return this.radios.filter(radio => radio.unmaintained);
};

Settings.prototype.updateUnmaintained = function(radioName, unmaintained) {
	const indexRadio = this.findRadioByName(radioName);
	if (indexRadio >= 0) {
		this.radios[indexRadio].unmaintained = unmaintained;
	}
};

Settings.prototype.resetAccount = function() {
	console.log("resetAccount");
	delete this.account;
	this.account = new Account();
	//this.radios = [];
	this.saveSettings();
	this.updateUI();
};

Settings.prototype.accountStatus = function() {
	if (!this.account.token && this.account.email === "undefined") { // fresh installation. request to submit email.
		return consts.UI_NEED_EMAIL;
	} else if ((!this.account.apikey || this.account.apikey === "undefined") && !this.account.token) { // registered, need account validation.
		return consts.UI_WAIT_CONFIRM;
	} else if (!this.account.token) { // registered, need to open confirmation link in mail inbox.
		return consts.UI_OPEN_EMAIL;
	} else if (this.account.email === "undefined") { // not registered
		this.account.token = "";
		return consts.UI_NEED_EMAIL;
	} else { // email confirmed, updated only if helpbox is visible
		return consts.UI_REGISTERED;
	}
};

Settings.prototype.setUILang = function(lang) {
	if (consts.LANGS.indexOf(lang) < 0) return;
	this.config.uiLang = lang;
	this.saveSettings();
	this.updateUI();
};

Settings.prototype.setRadiosCountry = function(country) {
	this.config.radiosCountry = country;
	this.saveSettings();
	this.updateUI();
};

Settings.prototype.importToken = function(token) {
	var decoded;
	try {
		decoded = jwt(token);
	} catch(e) {
		console.log("could not decode token: " + e);
		return null;
	}
	this.account.email = decoded.email;
	this.account.apikey = decoded.apikey;
	this.account.token = token;
	this.saveSettings();
	return decoded;
};

export default Settings;
