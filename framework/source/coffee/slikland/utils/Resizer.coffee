#import slikland.event.EventDispatcher
#import slikland.utils.DOMUtils

class Resizer extends EventDispatcher

	@RESIZE: 'resize_resizer'
	@ORIENTATION_CHANGE: 'orientation_change_resizer'
	@BREAKPOINT_CHANGE: 'breakpoint_changed_resizer'

	_bounds = null
	_body = null

	@getInstance:(p_start=true)=>
		@_instance ?= new @(p_start)

	constructor:(p_start=true)->
		_body = document.querySelector("body")
		_bounds = {"top":0, "bottom":0, "left":0, "right":0}
		@_currentOrientation = @orientation
		if p_start? then @start()
		
	@get width:->
		return window.innerWidth

	@get height:->
		return window.innerHeight

	@get orientation:->
		ratio = screen.width/screen.height
		if window.innerWidth > window.innerHeight and ratio > 1.3 then 'landscape' else 'portrait'

	@get bounds:->
		return _bounds

	@set bounds:(p_value)->
		_bounds = p_value

	start:()=>
		window.addEventListener 'resize', @change
		window.addEventListener 'orientationchange', @change
		@change(null, true)

	stop:()=>
		window.removeEventListener 'resize', @change
		window.removeEventListener 'orientationchange', @change

	change:(evt, allKinds = false)=>
		evt?.preventDefault()
		evt?.stopImmediatePropagation()
		
		_data = {
			"width": @width,
			"height": @height,
			"bounds": @bounds,
			"orientation": @orientation
		}

		if evt?.type == "resize" then @trigger Resizer.RESIZE, _data
		if @_currentOrientation != @orientation
			@trigger Resizer.ORIENTATION_CHANGE, _data
			@_currentOrientation = @orientation
		if app.conditions?
			for k, v of app.conditions.list
				if v['size']? || v['orientation']? || !!allKinds
					if app.conditions.test(k)
						if !@hasClass(k) then @addClass(k)
					else
						if @hasClass(k) then @removeClass(k)

			for k, v of app.conditions.list
				if v['size']? || v['orientation']? || !!allKinds
					if app.conditions.test(k)
						_data['breakpoint'] = {key:k, values:v}
						if @latestKey != k
							@latestKey = k
							@trigger Resizer.BREAKPOINT_CHANGE, _data
						break

				
	addClass:(className)->
		return DOMUtils.addCSSClass(_body, className)

	removeClass:(className)->
		return DOMUtils.removeCSSClass(_body, className)

	hasClass:(className)->
		return DOMUtils.hasCSSClass(_body, className)
