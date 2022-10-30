self.addEventListener('activate', function serviceWorkerActivate(event) {
	console.log("serviceWorker got activate event!");

	event.waitUntil(
	caches.open('v1').then(function(cache) {
		return cache.addAll([
			'./fishtank.htm',
			'./fishtank.js',
			'./vector.js',
			'./fishSprite.png',
			'./pwa.js',
			'./fishtank-sw.js',
			'./manifest.webmanifest',
			'./fishtank_192.png'
		]).catch(function(err) {
			console.warn("serviceWorker failed to add all files to cache! Error: " + err.message);
		});

	}, function(err) {
		console.warn("serviceWorker failed to open cache! Error: " + err.message);
	})
	); // waitUntil does not return a promise!

});

self.addEventListener('fetch', function serviceWorkerFetch(event) {
	console.log("serviceWorker fetch url=" + event.request.url + "");

	// Use cache only when offline to make sure user see new updates

	event.respondWith(
	caches.match(event.request).then(function(response) {
		if (response && !navigator.onLine) {
			console.log("serviceWorker Serving from cache: " + event.request.url);
			return response;
		}
		else {
			console.log("serviceWorker Serving from server (" + (response ? "it's cached" : "NOT IN CACHE") + "): " + event.request.url);

			return fetch(event.request).then(function(response) {
				return response;
			});

		}
	}, function(err) {
		console.warn("serviceWorker fetch caches.match error: " + err.message);
		return fetch(event.request);
	})
	); // respondWith does not return a Promise!

});
