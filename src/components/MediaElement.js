import React, { Component } from "react";
import "../../node_modules/hls.js/dist/hls.light.js";
//import "hls.js";
import "mediaelement";

// Import stylesheet and shims
//import "mediaelement/build/mediaelementplayer.min.css";
//import "mediaelement/build/mediaelement-flash-video.swf";
import PropTypes from "prop-types";


export default class MediaElement extends Component {

	constructor(props) {
		super(props);
		this.state = { player: null, errorMode: false, srcBeingUpdated: false };
	}
	//state = {}

	success(media, node, instance) {
		// Your action when media was successfully loaded
		//media.play();
		console.log("MediaElement: " + media + " " + node + " " + instance);

		let self = this;
		media.addEventListener("error", function(err) {
			// https://html.spec.whatwg.org/multipage/media.html#error-codes
			// const unsigned short MEDIA_ERR_ABORTED = 1;
			// const unsigned short MEDIA_ERR_NETWORK = 2;
			// const unsigned short MEDIA_ERR_DECODE = 3;
			// const unsigned short MEDIA_ERR_SRC_NOT_SUPPORTED = 4;

			if (self.state.player.src.slice(-1) !== "/") { // empty src gives the page url ending with "/". do no try alt codecs if there is empty src.
				console.log("playback error: " + err.detail.target.error.code + " at url " + self.state.player.src);
				self.setState({ errorMode: true });
				self.props.onError(err);
			} /*else {
				console.log("playback error ignored");
			}*/

			/*if(err.detail.target.error.code === 2) {
				console.log("mediaElement: network error. try restarting playback"); // for some streams, the playbacks resumes automatically
				let correctSrc = media.src;
				let player = self.state.player;
				player.currentTime = 0;
				player.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAVFYAAFRWAAABAAgAZGF0YQAAAAA=";
				self.setState({ player: player }, function() {
					self.state.player.load();
					let player = self.state.player;
					player.src = correctSrc;
					self.setState({ player: player }, function() {
						self.state.player.play();
					});
				});
			} else {*/

			//}

		});

		media.addEventListener("play", function() {
			console.log("playback started");
		});

		media.addEventListener("pause", function() {
			console.log("playback paused, srcBeingUpdated=" + self.state.srcBeingUpdated);
			if (!self.state.srcBeingUpdated) {
				self.props.onPause();
			}
		});

	}

	error(media) {
		// Your action when media had an error loading
		console.log("MediaElement: error " + media);
	}

	UNSAFE_componentWillReceiveProps(nextProps) { // TODO update this

		if (this.state.player && this.props.url !== nextProps.url) {
			this.setState({ srcBeingUpdated: true }, function() {
				let player = this.state.player;
				/*if (!nextProps.url) {
					this.state.player.pause();
				}*/
				player.currentTime = 0;
				player.src = nextProps.url;
				let self = this;
				this.setState({ player: player, errorMode: false }, function() {
					if (self.state.player.src && self.state.player.src.slice(-1) !== "/") {
						//self.state.player.load();
						let player = self.state.player;
						player.load();
						player.options.startVolume = nextProps.volume;
						player.volume = nextProps.volume;
						self.state.player.play();
						self.setState({ player: player, srcBeingUpdated: false});
					} else {
						this.setState({ srcBeingUpdated: false });
						//console.log("MediaPlayer: new props with empty url, do not play");
					}
				});
				console.log("MediaElement: url updated to " + nextProps.url);
			});
		} else if (!this.state.player && this.props.url !== nextProps.url) {
			console.log("MediaElement: warn: url update but no player yet");
		}

		if (this.state.player && this.props.volume !== nextProps.volume) {
			let player = this.state.player;
			player.volume = nextProps.volume;
			this.setState({ player: player });
			console.log("MediaElement: volume updated to " + nextProps.volume);
		} else if (!this.state.player && this.props.volume !== nextProps.volume) {
			console.log("MediaElement: warn: volume update but no player yet");
		}
	}

	render() {

		//const props = this.props;
		//const source = JSON.parse(this.props.source);
		//const tracks = JSON.parse(props.tracks);
		//const sourceTags = [];
		//const tracksTags = [];

		/*for (let i = 0, total = sources.length; i < total; i++) {
			const source = sources[i];
			sourceTags.push(`<source src="${source.src}" type="${source.type}">`);
		}

		for (let i = 0, total = tracks.length; i < total; i++) {
			const track = tracks[i];
			tracksTags.push(`<track src="${track.src}" kind="${track.kind}" srclang="${track.lang}"${(track.label ? ` label=${track.label}` : "")}>`);
		}

		const mediaBody = `${sourceTags.join("\n")}${tracksTags.join("\n")}`;*/
		/*const mediaHtml = props.mediaType === "video" ?
				`<video id="${props.id}" width="${props.width}" height="${props.height}"${(props.poster ? ` poster=${props.poster}` : "")}
					${(props.controls ? " controls" : "")}${(props.preload ? ` preload="${props.preload}"` : "")}>
					${mediaBody}
				</video>` :
				`<audio id="${props.id}" width="${props.width}" controls>
					${mediaBody}
				</audio>`
		;

		return (<div dangerouslySetInnerHTML={{__html: mediaHtml}}></div>);*/

		return (
			<audio id={this.props.id} width={this.props.width}>
				<source src={this.props.url} />
			</audio>
		);
	}

	componentDidMount() {

		const {MediaElementPlayer} = window;

		if (!MediaElementPlayer) {
			return;
		}

		const options = Object.assign({}, JSON.parse(this.props.options), {
			// Read the Notes below for more explanation about how to set up the path for shims
			pluginPath: "./static/media/",
			startVolume: this.props.volume,
			success: (media, node, instance) => this.success(media, node, instance),
			error: (media, node) => this.error(media, node)
		});

		let player = new MediaElementPlayer(this.props.id, options);
		window.meplayer = player;
		player.volume = this.props.volume;
		//if (this.props.url) player.play();
		this.setState({player: player });
	}

	componentWillUnmount() {
		if (this.state.player) {
			this.state.player.remove();
			this.setState({player: null});
		}
	}
}

MediaElement.propTypes = {
	id: PropTypes.string.isRequired,
	//mediaType: PropTypes.string.isRequired,
	//preload: PropTypes.string.isRequired,
	//controls: PropTypes.bool.isRequired,
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	//poster: PropTypes.string.isRequired,
	url: PropTypes.string.isRequired,
	//type: PropTypes.string.isRequired,
	options: PropTypes.string.isRequired,
	volume: PropTypes.number,
	onError: PropTypes.func.isRequired,
	onPause: PropTypes.func.isRequired,
	//tracks: PropTypes.string.isRequired
};


/* usaqe
	<MediaElement
		id="player1"
		mediaType="audio"
		preload="none"
		controls={false}
		width={640}
		height={360}
		poster=""
		sources={JSON.stringify(this.state.sources)}
		options={"{}"}
		tracks={"{}"} />


);
*/
