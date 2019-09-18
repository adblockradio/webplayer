import consts from "./consts.js";
//const io = require("../node_modules/socket.io-client/dist/socket.io.js)";
import * as io from "../node_modules/socket.io-client/dist/socket.io.js";
//import "../node_modules/hls.js/dist/hls.light.js";
//import "mediaelement";
//const {MediaElementPlayer} = window;

export default function(settings, updateUI) {

	//var audioElement; // = document.createElement("audio");

	//var player =
	/*var audioElement = new MediaElementPlayer("meplayer", {
		pluginPath: "/",
	// When using `MediaElementPlayer`, an `instance` argument
	// is available in the `success` callback
		success: function(mediaElement, originalNode, instance) {
			audioElement = instance;
			console.log("MediaElementPlayer: success");
			// do things
		},
		error: function(media) {
			// Your action when media had an error loading
			console.log("MediaElementPlayer: error " + media);
		}
	});*/

	// global variables
	var backgroundPlaying = null;
	var sio;
	let hosts;

	var togglePlay, playInBackground, stopPlayInBackground, getActiveIndex;

	var validateEmail = function(email) { // some text @ some text . some text
		if (!(typeof email === "string") && !(email instanceof String)) return false;
		var i1 = email.indexOf("@");
		if (i1 < 0 || i1 >= email.length) return false;
		var i2 = email.slice(i1).indexOf(".");
		if (i2 < 1 || i2 >= email.slice(i1).length) return false;
		var i3 = email.indexOf(" ");
		if (i3 >= 0) return false;
		return true;
	};

	var apikeyBeingReset = false;

	const apikeySetup = function(newEmail, sendEmail) {
		console.log("api key setup");
		if (newEmail !== undefined) {
			settings.account.email = newEmail;
			settings.saveSettings();
		}
		if (!validateEmail(settings.account.email)) {
			console.log("apikeySetup: invalid email: " + settings.account.email + ". abort");
			settings.resetAccount();
			return updateUI();
		}
		apikeyBeingReset = true;
		sio.emit("newApiKey", { email: settings.account.email, lang: settings.config.uiLang, sendEmail: sendEmail }, function(result) {
			apikeyBeingReset = false;
			if (!result.error) {
				console.log("received api key: " + result.apikey);

				//settings.importToken(result.token);

				settings.account.apikey = result.apikey;
				settings.saveSettings();
				updateUI();
				//sendPlaylist();
			} else if (result.error === "invitation only") {
				console.log("api key creation is currently disabled. please ask for an invite");
			} else {
				console.log("problem during new api key request: " + result.error);
				updateUI();
			}
		});
	};


	const sendPlaylist = function() {
		if (!settings.account.token && settings.account.email === "undefined") {
			settings.resetAccount();
			console.log("enter your email first");
			updateUI();
			return;

		} else if (!settings.account.token && settings.account.email !== "undefined") {
			console.log("api key not defined. request a new one…");
			return apikeySetup(settings.account.email, false);
		}

		if (apikeyBeingReset) {
			console.log("api key is already being reset, retry in a few seconds");
			return setTimeout(sendPlaylist, 2000);
		}

		console.log("send playlist update");
		var radioArray = [];
		for (var i=0; i<settings.radios.length; i++) {
			radioArray.push(settings.radios[i].country + "_" + settings.radios[i].name);
		}
		//console.log("send playlist event with token : " + settings.account.token);
		sio.emit("playlist", { token: settings.account.token, names: radioArray }, function(msg) {
			if (msg.error) {
				console.log("playlist update problem: " + msg.error);
			}
			if (msg.error === "API key is invalid" || msg.error === "please login first") {
				console.log("playlist: server responded with message " + msg.error);
				settings.account.apikey = "undefined";
				settings.account.token = "";
				return sendPlaylist();
			}
			/*if (msg.maxPlaylistLen) {
				settings.account.maxPlaylistLen = msg.maxPlaylistLen;
				console.log("max playlist len set to " + msg.maxPlaylistLen);
				settings.saveSettings();
			}*/
			if (msg.unmaintained) {
				for (let i=0; i<radioArray.length; i++) {
					settings.updateUnmaintained(radioArray[i], msg.unmaintained[i]);
				}
			}

			// remove elements of the local playlist that are not in the playlist of the replay (in case the submitted playlist was too long)
			if (msg.playlist) {
				for (var i=0; i<settings.radios.length; i++) {
					if (!msg.playlist.includes(settings.radios[i].country + "_" + settings.radios[i].name)) {
						console.log("radio " + settings.radios[i].country + "_" + settings.radios[i].name + " not in playlist response " + msg.playlist + ". remove it");
						settings.removeRadio(settings.radios[i].name);
					}
				}
			}
		});
	};


	const addRadio = function(data) {
		let radioWasNotInPlaylist = settings.addRadio(data);
		if (radioWasNotInPlaylist) sendPlaylist();
	};

	const getFilteredVolume = function(status) {//}, musicAllowed, speechAllowed, filterOff) {

		let musicAllowed = true;
		let speechAllowed = settings.config.filterType !== consts.FILTER_MUSIC;
		let filterOff = settings.config.filterType === consts.FILTER_OFF;

		if (filterOff ||
			(status === consts.STATUS_MUSIC && musicAllowed) ||
			(status === consts.STATUS_SPEECH && speechAllowed) ||
			(status === consts.STATUS_NOT_AVAILABLE) ||
			(status === consts.STATUS_FREEMIUM_DISABLED)) {
			return consts.VOLUME_NORMAL;
		} else if (status === consts.STATUS_NOT_AVAILABLE_TEMPORARY) {
			return consts.VOLUME_UNKNOWN;
		} else {
			return consts.VOLUME_MUTED;
		}
	};

	const volumeControl = {
		VOLUME_STEPS: 0.1,
		VOLUME_REFRESH_MS: 100,
		GAIN_REF: 70,

		save(vol) {
			settings.config.userVolume = vol;
			const targetVol = volumeControl.set(true);
			updateUI();
			settings.saveSettings();
			return targetVol;
		},

		set(applyImmediately) {
			const indexRadio = getActiveIndex();
			const scaledVol = settings.config.filterVolume * settings.config.userVolume;
			let targetVol = scaledVol * Math.pow(10, (1 - scaledVol) * -0.8);
			
			if (!isNaN(indexRadio)) {
				const status = settings.radios[indexRadio].status;
				// status might be null if no prediction has been sent until now
				if (status && status[status.length - 1]) {
					const gain = status[status.length - 1].gain;
					if (!isNaN(gain) && gain > 0) {
						targetVol *= Math.pow(10, Math.min(volumeControl.GAIN_REF - gain, 0) / 20);
					}
				} else {
					console.log("volumeControl: warn: indexRadio=" + indexRadio + " status=" + JSON.stringify(status));
				}
			}

			if (!applyImmediately && targetVol > settings.player.volume + volumeControl.VOLUME_STEPS) {
				settings.player.volume += volumeControl.VOLUME_STEPS;
				setTimeout(volumeControl.set, volumeControl.VOLUME_REFRESH_MS);
			} else if (!applyImmediately && targetVol < settings.player.volume - volumeControl.VOLUME_STEPS) {
				settings.player.volume -= volumeControl.VOLUME_STEPS;
				setTimeout(volumeControl.set, volumeControl.VOLUME_REFRESH_MS);
			} else {
				settings.player.volume = targetVol;
			}
			return targetVol;
		}
	};

	const doAction = function() {

		let indexRadio = getActiveIndex();
		if (isNaN(indexRadio)) return null; // no radio is played

		var indexesToScan = [];
		if (settings.config.filterType === consts.FILTER_OFF || settings.config.actionType === consts.ACTION_MUTE) {
			indexesToScan.push(indexRadio);
		} else if (settings.config.actionType === consts.ACTION_ROUNDABOUT) {
			for (let i=indexRadio; i<settings.radios.length; i++) { indexesToScan.push(i);	}
			for (let i=0; i<indexRadio; i++) {						indexesToScan.push(i);	}
		} else if (settings.config.actionType === consts.ACTION_PODIUM) {
			for (let i=0; i<settings.radios.length; i++) {			indexesToScan.push(i);	}
		}

		var indexChosen = -1;
		var volumeChosen = consts.VOLUME_UNKNOWN;

		if (indexChosen < 0) {
			for (let iScan=0; iScan<indexesToScan.length; iScan++) { // find another station with good content
				let i = indexesToScan[iScan];
				var volume = getFilteredVolume(settings.radios[i].getStatus());
				if (volume === consts.VOLUME_UNKNOWN && i === indexRadio) {
					return null; // no op, wait for signal to come back
				} else if (volume === consts.VOLUME_NORMAL) {
					indexChosen = i;
					volumeChosen = volume;
					break;
				}
			}
		}

		// in no other station with good content found, mute the current station
		if (indexChosen === -1) {
			indexChosen = indexRadio;
			volumeChosen = getFilteredVolume(settings.radios[indexChosen].getStatus());
			if (volumeChosen === consts.VOLUME_UNKNOWN) { return null; } // no-op
		}

		// if the chosen radio is not the same than the previous one, play it in background (it also cuts streams in tabs)
		if (indexChosen !== indexRadio) {
			playInBackground(settings.radios[indexChosen].name);
			indexRadio = indexChosen;
		}

		if (indexRadio >= 0) {
			//console.log("background player set to volume " + volumeChosen);
			settings.config.filterVolume = volumeChosen;
			volumeControl.set(false);
		}
	};

	const manualTuning = function(delta) {
		let iref = getActiveIndex(), n = settings.radios.length;
		if (delta === 0 || n <= 1 || isNaN(iref) || settings.config.actionType === consts.ACTION_PODIUM) return;

		let targetVolume = consts.VOLUME_MUTED, i = iref;

		while (targetVolume === consts.VOLUME_MUTED) {
			i += delta;
			if (i >= n) i = 0;
			if (i < 0) i = n - 1;
			targetVolume = getFilteredVolume(settings.radios[i].getStatus());
			if (i === iref) return; // we have checked the whole playlist, no change is desired
		}

		togglePlay(settings.radios[i].name);
	};

	playInBackground = function(radioName) {

		var indexRadio = settings.findRadioByName(radioName);

		if (indexRadio >= 0) {
			stopPlayInBackground();
			backgroundPlaying = radioName;
			settings.radios[indexRadio].playing = true;
			var targetVol = volumeControl.save(settings.config.userVolume);
			console.log("play " + radioName + " at url " + settings.radios[indexRadio].url + " at vol " + targetVol);

			settings.player.url = settings.radios[indexRadio].url;  //s[0];
			//audioElement.play();

			if (settings.radios[indexRadio].getStatus() === consts.STATUS_STREAM_BROKEN) settings.radios[indexRadio].addStatus(consts.STATUS_NOT_AVAILABLE);

			console.log("notification name=" + settings.radios[indexRadio].name + " url=" + settings.radios[indexRadio].logo);

			document.title = settings.radios[indexRadio].name + " - Adblock Radio";

			//execCompat(root.notifications.create, ["streamFoundNotification", {
			//"type": "basic",
			//"iconUrl": radios[indexRadio].logo, // this causes an error in chrome, because fetching an external image for a notification is not allowed.
			//"title": "Adblock Radio",
			//"message": "Vous écoutez maintenant " + radios[indexRadio].name
			//}]);

			//browser.browserAction.setIcon({path: radios[indexRadio].logo });
			//updateRadioMetadata(radioName);
		}
	};


	stopPlayInBackground = function() {
		if (backgroundPlaying) {
			var indexRadio = settings.findRadioByName(backgroundPlaying);
			if (indexRadio >= 0) {
				settings.radios[indexRadio].playing = false;
			}
			settings.config.filterVolume = 1.0;

			console.log("stopping background player that was playing " + backgroundPlaying);
			/*audioElement.pause();
			audioElement.currentTime = 0;
			try {
				audioElement.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAVFYAAFRWAAABAAgAZGF0YQAAAAA=";
				audioElement.play();
			} catch(e) {
				// no-op
			}*/
			settings.player.url = "";
			//backgroundPlayer = null;
			backgroundPlaying = null;
			document.title = "Adblock Radio";
			//execCompat(browser.browserAction.setIcon, [{ path: browser.extension.getURL("icons/logo-32.png") }]);
		} else {
			//console.log("attempted to stop background player, but not found");
		}
	};

	const onPlayerError = function(err) {
		console.log("playing error: ");
		console.log(err);

		consts.getStreamUrlMime(settings.player.url, function(newUrl) {//, newType) {
			if (settings.player.url !== newUrl) {
				console.log("stream url has been updated to " + newUrl);
				settings.player.url = newUrl;
			} else {
				var indexRadio = settings.findRadioByName(backgroundPlaying);
				//updateRadioMetadata(backgroundPlaying);
				if (indexRadio < 0) return;
				settings.radios[indexRadio].addStatus(consts.STATUS_STREAM_BROKEN);
				setTimeout(function() {
					settings.radios[indexRadio].addStatus(consts.STATUS_NOT_AVAILABLE); // when a player error happens, blacklist the stream for 15 seconds
				}, 15000);
				doAction();
			}
		});
	};

	let token = consts.getParameterByName("t");
	if (token) {
		var decoded = settings.importToken(token);
		console.log("decoded contents: " + decoded);
		if (settings.account.email !== decoded.email && decoded.email) {
			settings.resetAccount();
		}
	}

	let lang = consts.getParameterByName("lang");
	if (lang) settings.setUILang(lang);

	console.log("email is " + settings.account.email);
	for (var i=0; i<settings.radios.length; i++) {
		settings.radios[i].playing = false;
		settings.radios[i].addStatus(consts.STATUS_NOT_AVAILABLE);
	}
	settings.saveSettings();
	if (consts.getParameterByName("t")) {
		//window.location.replace(location.toString().split("?")[0]); // strip query string
		window.history.replaceState({}, null, window.location.toString().split("?")[0]);
	}

	var setUpdateUI = function(updateUIFun) {
		console.log("set update UI");
		updateUI = updateUIFun;
	};

	//var changeApikey = function(newApikey) {
	//apikey = newApikey;
	//saveSettings();
	//doAction();
	//}

	var changeFilterType = function(newFT) {
		settings.config.filterType = newFT;
		if (newFT === consts.FILTER_OFF) {
			settings.config.actionType = consts.ACTION_MUTE;
		}
		settings.saveSettings();
		doAction();
		updateUI();
	};

	var changeActionType = function(newAT) {
		settings.config.actionType = newAT;
		settings.saveSettings();
		doAction();
		updateUI();
	};

	var removeRadio = function(radioName) {
		let indexRadio = settings.removeRadio(radioName);
		if (indexRadio >= 0) {
			if (backgroundPlaying === radioName) {
				stopPlayInBackground();
			}
			sendPlaylist();
		}
	};

	var moveRadio = function(hoveredRadio, destination, callback) {
		console.log("move Radio " + hoveredRadio + " / " + destination);
		var ir = settings.findRadioByName(hoveredRadio);
		var indexDestination = settings.findRadioByName(destination);

		if (ir >= 1 && destination === "up") { // move hoveredRadio up
			settings.radios = settings.radios.slice(0, ir-1).concat([settings.radios[ir], settings.radios[ir-1]]).concat(settings.radios.slice(ir+1));
			//console.log("send playlist");
			callback();
			sendPlaylist();
			//console.log("playlist sent");
		} else if (ir < settings.radios.length-1 && destination === "down") { // move hoveredRadio down
			settings.radios = settings.radios.slice(0, ir).concat([settings.radios[ir+1], settings.radios[ir]]).concat(settings.radios.slice(ir+2));
			callback();
			sendPlaylist();
		} else if ((destination === "up" && ir === 0) || (destination === "down" && ir === settings.radios.length-1)) { // toggle first and last radios
			settings.radios = [settings.radios[settings.radios.length-1]].concat(settings.radios.slice(1, settings.radios.length-1)).concat([settings.radios[0]]);
			callback();
			sendPlaylist();
		} else if (indexDestination >= 0 && ir >= 0) { // arbitrary permutation with hover
			console.log("drop " + destination + " (index=" + indexDestination + ") on " + hoveredRadio + " (index=" + ir + ")");
			if (indexDestination > ir) {
				settings.radios = settings.radios.slice(0, ir).concat([settings.radios[indexDestination]])
					.concat(settings.radios.slice(ir, indexDestination), settings.radios.slice(indexDestination+1));
			} else if (indexDestination < ir) {
				settings.radios = settings.radios.slice(0, indexDestination).concat(settings.radios.slice(indexDestination+1, ir+1))
					.concat([settings.radios[indexDestination]]).concat(settings.radios.slice(ir+1));
			}
			callback();
			sendPlaylist();
		}
	};

	var getSupportedRadios = function(callback) {
		sio.emit("supportedRadios", {}, function(res) {
			settings.setCatalog(res.supportedRadios);
			settings.mpll = res.maxPlaylistLen;
			console.log("catalog loaded with " + res.supportedRadios.length + " radios");
			console.log(res.supportedRadios);
			callback();
		});
	};

	var getRadio = function(country, name, callback) {
		if (settings.checkPendingCatalogUpdate(country, name)) { // do not do another request if another one has already been made
			//console.log("getRadio: update is pending, abort.");
			if (callback) return callback(null);
			return;
		}
		settings.setPendingCatalogUpdate(country, name, true);
		//console.log("fetch metadata for radio " + country + "_" + name);
		consts.post(
			"https://www.radio-browser.info/webservice/json/stations/search",
			"country=" + country + "&countryExact=True&name=" + name + "&nameExact=True",
			function(results) {
				//console.log("received " + results.length + " radios as a result");
				for (let i=0; i<results.length; i++) {
					if (results[i].country !== country || results[i].name !== name) {
						continue;
					}
					results[i].alreadyInPlaylist = settings.findRadioByName(results[i].country + "_" + results[i].name) >= 0;
					settings.updateCatalogEntry(results[i]);
					//settings.setPendingCatalogUpdate(country, name, false);
					if (callback) return callback(results[i]);
				}
				if (callback) return callback(null);
			}
		);
	};

	var getServerList = function(callback) {
		const DEV = consts.getParameterByName("dev"); // ? true : false;

		if (!DEV) {
			consts.load(consts.APIHOSTS_LIST, function(data) {
				try {
					hosts = JSON.parse(data);
				} catch (e) {
					console.log("could not get api servers list: " + e);
					hosts = [];
				}

				for (let i=0; i<hosts.length; i++) {
					hosts[i] = "https://status." + hosts[i];
				}

				console.log("hosts: " + hosts);

				let ihost = Math.floor(Math.random()*hosts.length); // Math.random() is always < 1
				connectServer(ihost);
				callback();
			});
		} else {
			console.log("DEV MODE");
			hosts = DEV === "local" ? ["http://localhost:3066"] : ["https://status." + DEV + ".adblockradio.com"];
			connectServer(0);
			callback();
		}
	};

	/*var onUrlFound = function(newUrl, callback) {
		consts.getHeaders(newUrl, function(newMimeType) {
			return callback(newUrl, newMimeType);
		});
	};*/

	togglePlay = function(radio) {
		console.log("toggleplay: radio " + radio);
		if (radio === undefined) {
			console.log("toggle playback");
			var isPlaying = false;
			for (var i=0; i<settings.radios.length; i++) {
				if (settings.radios[i].name === backgroundPlaying) {
					isPlaying = true;
					break;
				}
			}
			if (isPlaying) {
				stopPlayInBackground();
			} else if (settings.radios.length > 0) {
				playInBackground(settings.radios[0].name);
			}
		} else if (backgroundPlaying === radio) {
			stopPlayInBackground();
		} else {
			var indexRadio = settings.findRadioByName(radio);
			if (indexRadio >= 0) {
				//if ([consts.FILTER_SPEECH, consts.FILTER_MUSIC].indexOf(filterType) >= 0) toggleMusic(radio, true);
				//if (filterType == consts.FILTER_SPEECH) toggleSpeech(radio, true);

				// put that radio at the beginning of the playlist
				if (settings.config.actionType === consts.ACTION_PODIUM && settings.config.filterType !== consts.FILTER_OFF) {
					settings.radios = [settings.radios[indexRadio]].concat(settings.radios.slice(0, indexRadio)).concat(settings.radios.slice(indexRadio+1));
				}

				playInBackground(radio);
			} else {
				return false;
			}
		}
		updateUI();
		return true;
	};

	var sendFeedback = function(small, large) {
		sio.emit("feedback", {
			email: settings.account.email,
			feedback: {
				small: small,
				large: large
			}
		});
	};

	var sendFlag = function() {
		let playlist = [];
		for (let i=0; i<settings.radios.length; i++) {
			playlist.push(settings.radios[i].country + "_" + settings.radios[i].name);
		}
		sio.emit("flag", {
			email: settings.account.email,
			playlist: playlist,
			filterType: settings.config.filterType,
			actionType: settings.config.actionType
		});
	};

	getActiveIndex = function() {
		for (let i=0; i<settings.radios.length; i++) {
			if (settings.radios[i].playing === true) return i;
		}
		return NaN;
	};

	var connectServer = function(ihost) {

		console.log("selected host is " + hosts[ihost]);

		sio = io(hosts[ihost]);

		sio.on("reconnect", function() {
			console.log("reconnected");
		});

		sio.on("connect", function() {
			console.log("connected to API host " + hosts[ihost]);
			sendPlaylist();
		});

		sio.on("connect_timeout", function() {
			console.log("connect timeout");
			ihost = (ihost + 1) % hosts.length;
			connectServer(ihost);
		});

		sio.on("predictions", function(data, ackFn) {
			//let msgStatus = "";
			for (var ir=0; ir<data.status.length; ir++) {
				var indexRadio = settings.findRadioByName(data.radios[ir]);
				if (indexRadio >= 0 && settings.radios[indexRadio].getStatus() !== consts.STATUS_STREAM_BROKEN) {
					settings.radios[indexRadio].addStatus(data.status[ir], data.gain[ir]);
					//msgStatus += data.radios[ir] + ":" + data.status[ir] + " / ";
					//console.log("radio " + settings.radios[indexRadio].name + " has gain of " + settings.radios[indexRadio].status[settings.radios[indexRadio].status.length-1].gain);
				}
			}
			//console.log("predictions: " + msgStatus);
			doAction();

			if (updateUI == null) {
				console.log("background: updateUI is null!!");
			} else {
				updateUI("predictions");
			}
			let pl = null;
			for (let ir=0; ir<settings.radios.length; ir++) {
				if (settings.radios[ir].playing === true) {
					pl = settings.radios[ir].country + "_" + settings.radios[ir].name;
					break;
				}
			}
			ackFn({ pl: pl, at: settings.config.actionType, ft: settings.config.filterType });
		});

		//sendPlaylist();

	};

	return {
		moveRadio,
		getRadio,
		getSupportedRadios,
		getServerList,
		togglePlay,
		manualTuning,
		onPlayerError,
		changeFilterType,
		changeActionType,
		addRadio,
		removeRadio,
		apikeySetup,
		getFilteredVolume,
		volume: volumeControl,
		setUpdateUI,
		getActiveIndex,
		sendFeedback,
		sendFlag,
		validateEmail,
		stopPlayInBackground,
	};

}
