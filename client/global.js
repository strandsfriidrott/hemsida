"use strict";

// With a web-app-manifest, users can add the app to home screen!
// https://developers.google.com/web/fundamentals/web-app-manifest/
var DISPLAY_MODE = "browser";
// detect if the display-mode is standalone from JavaScript:
if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
	console.log('display-mode is standalone');
	DISPLAY_MODE = "standalone";
}

// To determine if the app was launched in standalone mode in Safari,
if (window.navigator.standalone === true) {
	console.log('display-mode is standalone');
	DISPLAY_MODE = "standalone";
}

if('connection' in navigator && navigator.connection.saveData) {
	var SAVE_BANDWIDTH = true;
}
else {
	var SAVE_BANDWIDTH = false;
}

var BROWSER = (function checkBrowser() {
	var userAgent = navigator.userAgent;
	var browser = "Unknown browser";

	if(!userAgent && typeof navigator != "object") return browser;

	var c = userAgent.search("Chrome");
	var f = userAgent.search("Firefox");
	var m8 = userAgent.search("MSIE 8.0");
	var m9 = userAgent.search("MSIE 9.0");
	var edge = userAgent.search("Edge");

	var isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
	var isIe = (userAgent.toLowerCase().indexOf("msie") != -1 || userAgent.toLowerCase().indexOf("trident") != -1);

	if(isSafari) browser = "Safari";
	else if (edge != -1) browser ="Edge"; // Edge masquerade as Chrome, so theck for Edge first!
	else if (f != -1) browser = "Firefox";
	else if (m9 != -1) browser ="MSIE 9.0";
	else if (m8 != -1) browser ="MSIE 8.0";
	else if (c != -1) browser = "Chrome";
	else if(isIe) browser = "MSIE";

	return browser;
})();

// Browsers work differently depending on which platofrm they are running ...
var ANDROID = navigator.userAgent.match(/Android/i);
var MSIE = (BROWSER.indexOf("MSIE") == 0); // If we are on Internet Explorer
var MSWIN = (navigator.platform == "Win32"); // If we are on Windows (any version)
var LINUX = (navigator.platform.indexOf("Linux") != -1); // If we are on Linux
var MAC = (navigator.platform.indexOf("Mac") != -1); // If we are on a Mac(book)
var CHROMEBOOK = (navigator.userAgent.indexOf("CrOS") != -1);
var FIREFOX = (navigator.userAgent.toLowerCase().indexOf('firefox') > -1);
var OPERA_MOBILE = (navigator.userAgent.indexOf("Opera Mobi") != -1);
var IOS_SAFARI = (function() {
	var ua = window.navigator.userAgent;
	var iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
	var webkit = !!ua.match(/WebKit/i);
	return iOS && webkit && !ua.match(/CriOS/i);
})();

var QUERY_STRING = function () {
	// Self calling function to not clutter global scope
	var query_string = {};
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		// If first entry with this name
		if (typeof query_string[pair[0]] === "undefined") {
			query_string[pair[0]] = decodeURIComponent(pair[1]);
			// If second entry with this name
		} else if (typeof query_string[pair[0]] === "string") {
			var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
			query_string[pair[0]] = arr;
			// If third or later entry with this name
		} else {
			query_string[pair[0]].push(decodeURIComponent(pair[1]));
		}
	}
	return query_string;
}();


