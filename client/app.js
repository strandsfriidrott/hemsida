

(function() {

	var pwaInstallPrompt;
	var asked = false;
	window.onbeforeinstallprompt = saveInstallPrompt;

	window.addEventListener("load", windowLoaded);

	function saveInstallPrompt(installPrompt) {
		pwaInstallPrompt = installPrompt;
	}

	function mousedown(ev) {
		if(pwaInstallPrompt && !asked) showPwaInstallPrompt();
	}

	function showPwaInstallPrompt() {
		if(!pwaInstallPrompt) {
			console.log("We have not yet got a pwa install prompt from the browser");
			
			if(IOS_SAFARI) document.location="safari.htm";

			if(!ANDROID && BROWSER != "Chrome") {
				alert("Det går troligtvis inte att installera appar på denna enhet :(");
			}

			return;
		}

		pwaInstallPrompt.prompt().then(function(res) {
			console.log("pwaInstallPrompt.prompt: ", res);

			// Wait for the user to respond to the prompt
			pwaInstallPrompt.userChoice.then(userDid);

		}).catch(function(err) {
			console.log("pwaInstallPrompt.prompt() error " + err.message);
		});


		function userDid(choiceResult) {
			if (choiceResult.outcome === 'accepted') {
				console.log('User accepted the A2HS prompt');
			} else {
				console.log('User dismissed the A2HS prompt');
			}
			pwaInstallPrompt = null;
			asked = true;
		}
	}

	function windowLoaded() {

		var appInstallButton = document.getElementById("install");

		if(DISPLAY_MODE == "standalone") {
			console.log("currently running the app");
			appInstallButton.parentElement.removeChild(appInstallButton);
		}
		else {
			appInstallButton.addEventListener("click", showPwaInstallPrompt)
		}

		var addPostButton = document.getElementById("make_post");
		addPostButton.addEventListener("click", function() {
			document.location = "post.htm?post=new";
		});

		registerServiceWorker();
	}

	function registerServiceWorker() {
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.register('fishtank-sw.js', {scope: '.'}).then(function(reg) {
				// registration worked
				console.log('ServiceWorker Registration succeeded. Scope is ' + reg.scope);
				return reg.update();

			}).catch(function(error) {
				// registration failed
				console.log('ServiceWorker Registration failed with ' + error);
			});
		}
	}

})();
