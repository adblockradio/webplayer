// eslint-disable-next-line
module.exports = function() {

	var _paq = [];
	// tracker methods like "setCustomDimension" should be called before "trackPageView"
	_paq.push(["trackPageView"]);
	_paq.push(["enableLinkTracking"]);
	(function() {
		var u="https://static.adblockradio.com/pwk/";
		_paq.push(["setTrackerUrl", u+"p.php"]);
		_paq.push(["setSiteId", "1"]);
		var d=document, g=d.createElement("script"), s=d.getElementsByTagName("script")[0];
		g.type="text/javascript"; g.async=true; g.defer=true; g.src=u+"p.js"; s.parentNode.insertBefore(g,s);
	})();
};
