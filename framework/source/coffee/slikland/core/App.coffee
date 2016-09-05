#import slikland.event.EventDispatcher

class App extends EventDispatcher
	@PROJECT : "SL_PROJECT_VERSION:0.0.0"
	@DATE : "SL_PROJECT_DATE:0000000000000"

	@FRAMEWORK_VERSION : "2.1.9"
	@PROJECT_VERSION : App.PROJECT.replace('SL_PROJECT_VERSION:', '')
	@PROJECT_DATE : new Date(parseFloat(App.DATE.replace('SL_PROJECT_DATE:', '')))

	constructor:()->
		super

		@_checkWindowActivity()
		#
		# TODO: FIX IE8
		#
	_checkWindowActivity:()->
		@_hidden = 'hidden'
		if @_hidden in document
			document.addEventListener 'visibilitychange', @_windowVisibilityChange
		else if (@_hidden = 'mozHidden') in document
			document.addEventListener 'mozvisibilitychange', @_windowVisibilityChange
		else if (@_hidden = 'webkitHidden') in document
			document.addEventListener 'webkitvisibilitychange', @_windowVisibilityChange
		else if (@_hidden = 'msHidden') in document
			document.addEventListener 'msvisibilitychange', @_windowVisibilityChange
		else if 'onfocusin' in document
			document.onfocusin = document.onfocusout = @_windowVisibilityChange
		else
			window.onpageshow = window.onpagehide = window.onfocus = window.onblur = @_windowVisibilityChange

		if document[@_hidden] != undefined
			@_windowVisibilityChange.call window, type: if document[@_hidden] then 'blur' else 'focus'

	_windowVisibilityChange:(evt)->
		v = 'visible'
		h = 'hidden'
		evtMap =
			focus: false
			focusin: false
			pageshow: false
			blur: true
			focusout: true
			pagehide: true
		evt = evt or window.event
		if evt.type in evtMap
			hidden = evtMap[evt.type]
		else
			hidden = document[@_hidden]

		eventType = if hidden then 'windowInactive' else 'windowActive'

		try
			@dispatchEvent(new Event(eventType))
		catch err
			newEvent = document.createEvent('Event')
			newEvent.initEvent(eventType, true, true)
			@dispatchEvent(newEvent)

if !app
	app = new App()

windowLoaded = =>
	if window.remove
		window.remove('load', windowLoaded)
	else if window.detachEvent
		window.detachEvent('onload', windowLoaded)
	else
		window.onload = null
	app.trigger('windowLoad')

if window.addEventListener
	window.addEventListener('load', windowLoaded)
else if window.attachEvent
	window.attachEvent('onload', windowLoaded)
else
	window.onload = windowLoaded
