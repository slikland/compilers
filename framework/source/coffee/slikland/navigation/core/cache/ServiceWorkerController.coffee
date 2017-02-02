class ServiceWorkerController extends EventDispatcher
	@getInstance:()=>
		@_instance ?= new @(arguments...)

	constructor:->
		super

	init:->
		console.log 'init'
		if ('serviceWorker' of navigator)
			navigator.serviceWorker
			.register(app.root + 'js/sw.js', {scope:'./'})
			.then(@_swRegistered)
			.catch(@_swRegisterError)

	_swRegistered:(evt)->
		console.log "Service Worker Registered", evt.scope
		console.log "Service Worker Registered", evt

	_swRegisterError:(err)->
		console.log "ServiceWorker registration failed: ", err
