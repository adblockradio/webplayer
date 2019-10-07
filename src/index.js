import React from "react";
import ReactDOM from "react-dom";

import App from "./components/App.js";
import "./index.css";
import * as track from "./track.js";
import loadCSS from "loadcss";

if ("serviceWorker" in navigator) {
	navigator.serviceWorker.ready.then(registration => {
		registration.unregister();
	});
}

loadCSS("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css", links => {
	links.forEach(link => console.log(link.href));
});

ReactDOM.render(<App />, document.getElementById("root"));

track();