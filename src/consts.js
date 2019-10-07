//import { ajax } from "../node_modules/jquery/src/jquery.js";

let consts = { //function() {
	//return {

	FILTER_MUSIC: 4001,
	FILTER_SPEECH: 4002,
	FILTER_OFF: 4003,

	ACTION_ROUNDABOUT: 4011,
	ACTION_PODIUM: 4012,
	ACTION_MUTE: 4013,

	STATUS_AD: 2001,
	STATUS_NOTAD: 2002,
	STATUS_SPEECH: 2003,
	STATUS_MUSIC: 2004,
	STATUS_NOT_AVAILABLE: 2005,
	STATUS_FREEMIUM_DISABLED: 2006,
	STATUS_NOT_AVAILABLE_TEMPORARY: 2007,
	STATUS_STREAM_BROKEN: 2008,

	STATUS_HISTORY_LENGTH: 120,

	COLOR_ADS:  "#FF6868",
	COLOR_SPEECH: "#8AD115",
	COLOR_MUSIC: "#00B5DE",

	VOLUME_MUTED: 0.2,
	VOLUME_NORMAL: 1.0,
	VOLUME_UNKNOWN: -1.0,

	UI_NEED_EMAIL: 1000,
	UI_WAIT_CONFIRM: 1001,
	UI_WITHOUT_EMAIL: 1002,
	UI_REGISTERED: 1003,
	UI_OPEN_EMAIL: 1004,
	//UI_LOADING: 1004,

	APIHOSTS_LIST: "https://www.adblockradio.com/api/servers",
	FLAGS_DIR: "flags/",

	LANGS: ["en", "fr"],
	COUNTRIES: ["France", "Argentina", "Belgium", "Canada", "Finland", "Germany", "Greece", "Italy", "Netherlands", "New Zealand", "Slovakia", "Spain", "Switzerland", "United Kingdom", "Uruguay"],
	MIMETYPES: { "mp3": "audio/mp3", "ogg":"audio/ogg", "aac": "audio/mp4", "m3u8": "application/x-mpegURL" },

	getStatusColor: function(status) {
		switch(status) {
			case this.STATUS_AD: return this.COLOR_ADS;
			case this.STATUS_SPEECH: return this.COLOR_SPEECH;
			case this.STATUS_MUSIC: return this.COLOR_MUSIC;
			default: return null;
		}
	},

	getHeaders: function(path, callback) {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState === this.HEADERS_RECEIVED) {
				let headers = xhttp.getResponseHeader("content-type") || xhttp.getResponseHeader("Content-Type");
				console.log("getHeaders: url " + path + " has content-type " + headers);
				xhttp.abort();
				return callback(headers);
			}
		};
		xhttp.onerror = function (e) {
			console.log("getHeaders: request failed: " + e);
		};
		xhttp.open("GET", path, true);
		xhttp.send();

	},

	load: function(path, callback) {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState === 4 && xhttp.status === 200) {
				callback(xhttp.responseText); //, xhttp.getResponseHeader("Content-Type"));
			}
		};
		xhttp.onerror = function (e) {
			console.log("getHeaders: request failed: " + e);
		};
		xhttp.open("GET", path, true);
		xhttp.send();
	},

	post: function(path, data, callback) {
		//console.log("post path " + path + " data " + data);

		var xhr = new XMLHttpRequest();
		xhr.open("POST", path, true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		// if (typeof chrome === 'undefined') xhr.setRequestHeader("User-Agent", "AdblockRadio/0.1");
		// in chrome, it is not possible to customize the user agent that way. error message: refused to set unsafe header user agent
		// relevant links:
		// http://stackoverflow.com/questions/21090733/changing-user-agent-in-xmlhttprequest-from-a-chrome-extension
		// https://stackoverflow.com/questions/10334909/associate-a-custom-user-agent-to-a-specific-google-chrome-page-tab/10339902#10339902

		xhr.onreadystatechange = function() {
			//console.log("post ready state change = " + xhr.readyState + " status " + xhr.status);
			if (xhr.readyState === 4 && xhr.status === 200) {
				try {
					callback(JSON.parse(xhr.responseText));
				} catch(e) {
					callback(xhr.responseText);
				}
			}
		};
		xhr.send(data);

	},

	getStreamUrlMime: function(url, callback) {
		var self = this;
		var onUrlFound = callback;
		this.getHeaders(url, function(mimeType) {
			if (["audio/x-mpegurl", "audio/x-scpls; charset=UTF-8", "video/x-ms-asf"].indexOf(mimeType) >= 0) { // M3U, PLS or ASF playlist
				console.log("detected playlist url: mimeType=" + mimeType);
				self.load(url, function(playlistContents) {
					var lines = playlistContents.split("\n");
					var isM3U = lines[0].indexOf("EXTM3U") >= 0; //mimeType === "audio/x-mpegurl";
					var isASF = lines[0].indexOf("<ASX") >= 0; //mimeType === "video/x-ms-asf";
					//vas isPLS = !(isM3U || isASF);

					for (var i=lines.length-1; i>=0; i--) {
						if (isM3U && lines[i].slice(0, 4) === "http") {
							return onUrlFound(lines[i], callback);

						} else if (isASF) {
							let p1 = lines[i].indexOf("<REF HREF=\"");
							if (p1 >= 0 && lines[i].slice(p1+11, p1+15) === "http") {
								return onUrlFound(lines[i].slice(p1+11).split("\"")[0], callback);
							}
						} else if (!isM3U && !isASF) {
							let p1 = lines[i].indexOf("=");
							if (p1 >= 0 && lines[i].slice(p1+1, p1+5) === "http") {
								return onUrlFound(lines[i].slice(p1+1), callback);
							}
						}
					}
					console.log("getPlaylistUrl: could not parse playlist");
					return callback(null, null);
				});
			} else {
				// url is likely playable "as is", no parsing to do
				console.log("getStreamUrlMime: stream has playable mime type: " + mimeType);
				return onUrlFound(url, callback);
			}
		});
	},

	getParameterByName: function(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[[\]]/g, "\\$&"); //name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return "";
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	},

	normStr: function(str) {
		return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // https://stackoverflow.com/a/37511463/5317732
	}
	//}
};

export default consts;
