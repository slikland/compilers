class ServiceWorkerController extends EventDispatcher
	@getInstance:()=>
		@_instance ?= new @(arguments...)

	constructor:->
		super

	init:->
		console.log 'init'
		if ('serviceWorker' of navigator)
			navigator.serviceWorker
			.register(app.root + 'dynamic/js/'+window.sw+'.js', {scope:'./'})
			.then(@_swRegistered)
			.catch(@_swRegisterError)

	_swRegistered:(registration)->
		#console.log "Service Worker Registered", registration.scope
		console.log "Service Worker Registered", registration

	_swRegisterError:(err)->
		console.log "ServiceWorker registration failed: ", err