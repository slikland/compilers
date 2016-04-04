#import slikland.event.EventDispatcher

class Resizer extends EventDispatcher

	@RESIZE: 'resizeResizer'
	@ORIENTATION_CHANGE: 'orientationChangeResizer'
	@BREAKPOINT_CHANGE: 'breakpointChangedResizer'

	@getInstance:()=>
		@_instance ?= new @(arguments...)

	constructor:()->
		#params
		@_data = {}
		@_refElement = document.body
		
		#listeners
		window.addEventListener 'resize', @_onResize
		window.addEventListener 'orientationchange', @_onOrientation
		
		#start
		@_breakpoints = app.config.breakpoints
		@_updateData()

	# Getters and Setters
	#-------------------------------------------
	@get data:->
		@_data

	@get breakpoint:->
		@_data['breakpoint']

	@get breakpoints:->
		@_breakpoints

	@get width:->
		@_data['width']

	@get height:->
		@_data['height']

	@get orientation:->
		@_data['orientation']

	# Public
	#-------------------------------------------
	resize:()=>
		@_resize()

	# Private
	#-------------------------------------------
	_onResize:(e)=>
		e.preventDefault()
		e.stopImmediatePropagation()
		clearTimeout @_resTimeout if @_resTimeout?
		@_resTimeout = setTimeout @_resize, 50

	_onOrientation:(e)=>
		e.preventDefault()
		e.stopImmediatePropagation()
		clearTimeout @_oriTimeout if @_oriTimeout?
		@_oriTimeout = setTimeout @_orientation, 50
		false

	_resize:()=>
		@_updateData()
		@trigger Resizer.RESIZE, @_data
		false

	_orientation:()=>
		@_updateData()
		@trigger Resizer.RESIZE, @_data
		false

	_updateData:->
		_breakpoint = @_getBreakpoint()
		_bpChanged = @_data.breakpoint != _breakpoint

		@_data = 
			width: window.innerWidth
			height: window.innerHeight
			orientation: if window.innerWidth > window.innerHeight then 'landscape' else 'portrait'
			breakpoint: _breakpoint
			
		if _bpChanged
			@trigger Resizer.BREAKPOINT_CHANGE, _breakpoint

	_getBreakpoint:->
		_breakpoint = 'mobile'
		@_refElement.className = @_refElement.className.split('mobile').join(" ")
		for b,i in @_breakpoints by -1
			@_refElement.className = @_refElement.className.split(b['name']).join(" ")
			if window.innerWidth >= b['size']
				if @_breakpoints.length >= i + 1
					_breakpoint = @_breakpoints[@_breakpoints.length - 1]['name']
				else
					_breakpoint = @_breakpoints[i+1]['name']
				break
		@_refElement.className += _breakpoint
		return _breakpoint
