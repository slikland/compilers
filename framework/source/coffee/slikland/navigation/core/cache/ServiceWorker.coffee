class ServiceWorker
	@CACHE_VERSION: app.info.version

	constructor:(@self)->
		console.log "ServiceWorker constructor", @self

		@_staticAssets = [
			"../../js/preloader.js",
			"../../js/vendors.js",
			"../../js/main.js",
			"../../css/preloader.css",
			"../../css/main.css",
			"../../css/fonts.css"
		]

		console.log ServiceWorker.CACHE_VERSION

		@self.addEventListener('install', @_install)
		@self.addEventListener('fetch', @_fetch)
		@self.addEventListener('activate', @_activate)

	_install:(event)=>
		console.log "ServiceWorker install"
		event.waitUntil(
			caches.open(ServiceWorker.CACHE_VERSION)
			.then((cache)=>
				return cache.addAll(@_staticAssets)
			)
		)

	_fetch:(event)=>
		if event.request.method isnt 'GET' or event.request.url.indexOf('sw.js') > -1
			# If we don't block the event as shown below, then the request will go to
			# the network as usual.
			console.log('WORKER: fetch event ignored.', event.request.method, event.request.url);
			return

		
		# cache falling back to network
		event.respondWith(
			caches.match(event.request)
			.then((response)=>
				console.log event.request.headers.getAll()
				# Cache hit - return response
				if (response)
					console.log "fetch response: ", response
					# response.setHeader(	"Access-Control-Allow-Headers", "x-requested-with, accept, authorization");
					return response

				fetchRequest = event.request.clone()

				return fetch(fetchRequest).then((response)=>
					if !response || response.status != 200 || response.type != "basic"
						return response

					responseToCache = response.clone()

					caches.open(ServiceWorker.CACHE_VERSION)
					.then((cache)=>
						cache.put(event.request, responseToCache)
					)

					return response
				)
			)
		)

	_activate:(event)=>
		event.waitUntil(
			caches.keys().then((cacheNames)=>
				return Promise.all(
					cacheNames.filter((cacheName)=>
						# Return true if you want to remove this cache,
						# but remember that caches are shared across
						# the whole origin
						if cacheName isnt ServiceWorker.CACHE_VERSION
							console.log 'delete', cacheName
							return true 
					).map((cacheName)=>
						return caches.delete(cacheName)
					)
				)
			)
		)

new ServiceWorker(self)
