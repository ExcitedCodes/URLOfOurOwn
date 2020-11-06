(function () {
	const cacheVersion = '20201106-resource';
	const offlineVersion = '20201106-offline';

	const offline = '/offline.html';
	const offlineMatch = /^https:\/\/[^\/]+\/offline\.html$/;

	function getOffline() {
		return caches.match(offline);
	}

	const cachePath = [
		/^https:\/\/[^\/]+\/favicon.ico$/,
		/^https:\/\/[^\/]+\/images\//,
		/^https:\/\/[^\/]+\/javascripts\//,
		/^https:\/\/[^\/]+\/stylesheets\//
	];

	self.addEventListener('fetch', (event) => {
		const request = event.request;
		if (offlineMatch.test(request.url)) {
			event.respondWith(fetch(request));
		} else if (cachePath.some(regex => regex.test(request.url))) {
			event.respondWith(caches.match(request).then((response) => {
				if (response) {
					return response;
				}
				return fetch(request).then((response) => {
					if (request.method === 'GET' && response.status === 200) {
						var copy = response.clone();
						caches.open(cacheVersion).then((cache) => {
							cache.put(request, copy);
						});
					}
					return response;
				}).catch(() => {
					return getOffline();
				});
			}));
		} else {
			event.respondWith(fetch(request).catch(() => {
				return getOffline();
			}));
		}
	});

	self.addEventListener('install', (event) => {
		event.waitUntil(self.skipWaiting());
	});

	self.addEventListener('activate', (event) => {
		event.waitUntil(caches.keys()
			.then(keys => keys.filter(k => k != cacheVersion && k != offlineVersion))
			.then(keys => Promise.all(keys.map(k => caches.delete(k))))
			.then(() => {
				caches.match(offline).then(r => {
					if (!r) {
						return caches.open(offlineVersion).then((cache) => cache.add(offline));
					}
				});
			}));
	});
})();
