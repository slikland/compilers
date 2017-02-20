#import slikland.event.EventDispatcher

class ServiceWorkerController extends EventDispatcher
	@const INSTALLING : "serviceworker_controller_installing"
	@const INSTALLED : "serviceworker_controller_installed"
	@const ACTIVE : "serviceworker_controller_active"
	@const CHANGE : "serviceworker_controller_change"
	@const ERROR : "serviceworker_controller_error"

	constructor:()->
		src = if app?.config?.cache?.src? then app?.config?.cache?.src else null
		scope = if app?.config?.cache?.scope? then app?.config?.cache?.scope else './'
		if src?
			navigator.serviceWorker
			.register(src, {scope:scope})
			.then(@registered)
			.catch(@error)
		super

	messages:(evt)=>
		console.log("from worker:", evt.data)

	registered:(evt)=>
		if evt.installing
			serviceWorker = evt.installing
			@trigger(ServiceWorkerController.INSTALLING, {data:serviceWorker})
		else if evt.waiting
			serviceWorker = evt.waiting
			@trigger(ServiceWorkerController.INSTALLED, {data:serviceWorker})
		else if evt.active
			serviceWorker = evt.active
			@trigger(ServiceWorkerController.ACTIVE, {data:serviceWorker})

		if serviceWorker
			serviceWorker.postMessage = (serviceWorker.webkitPostMessage || serviceWorker.postMessage)
			serviceWorker.postMessage(app.info.version)
			serviceWorker.addEventListener('message', @messages)
			serviceWorker.addEventListener('statechange', @change)

	change:(evt)=>
		@trigger(ServiceWorkerController.CHANGE, {data:evt})

	error:(err)=>
		console.log 'ServiceWorkerController registration failed: ', err
		@trigger(ServiceWorkerController.ERROR, {data:err})
