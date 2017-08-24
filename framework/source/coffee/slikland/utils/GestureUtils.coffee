###*
Methods for gesture and touch
@class GestureUtils
###
class GestureUtils extends EventDispatcher

	@ON_SWIPE_LEFT: 'onSwipeLeft'
	@ON_SWIPE_RIGHT: 'onSwipeRight'
	@ON_SWIPE_UP: 'onSwipeUp'
	@ON_SWIPE_DOWN: 'onSwipeDown'
	@ON_TOUCH_START: 'onTouchStart'
	@ON_TOUCH_END: 'onTouchEnd'

	constructor:()->
		super

	registerElement:(element)=>
		@_xDown = null
		@_yDown = null
		@_element = element
		@_element.on 'mousedown', @_onTouchStart
		@_element.on 'touchstart', @_onTouchStart
		@_element.on 'mouseup', @_onTouchEnd
		@_element.on 'touchend', @_onTouchEnd
		document.body.on "touchend", @_onTouchEnd
		document.body.on "mouseup", @_onTouchEnd

	_onTouchStart:(event)=>
		if event.touches
			clientX = event.touches[0].clientX
			clientY = event.touches[0].clientY
		else
			clientX = event.clientX
			clientY = event.clientY 

		@_xDown = clientX
		@_yDown = clientY

		@_element.on 'mousemove', @_onTouchMove
		@_element.on 'touchmove', @_onTouchMove

		@trigger GestureUtils.ON_TOUCH_START, event

	_onLeft:(callback)=>
		@trigger GestureUtils.ON_SWIPE_LEFT

	_onRight:(callback)=>
		@trigger GestureUtils.ON_SWIPE_RIGHT

	_onUp:(callback)=>
		@trigger GestureUtils.ON_SWIPE_UP

	_onDown:(callback)=>
		@trigger GestureUtils.ON_SWIPE_DOWN

	_onTouchMove:(event)=>
		if event.touches
			@_clientX = event.touches[0].clientX
			@_clientY = event.touches[0].clientY
		else
			@_clientX = event.clientX
			@_clientY = event.clientY 

	_onTouchEnd:(event)=>
		return if !@_xDown or !@_yDown

		clientX = @_clientX
		clientY = @_clientY
			
		xUp = clientX
		yUp = clientY
		@_xDiff = @_xDown - xUp
		@_yDiff = @_yDown - yUp
		if Math.abs(@_xDiff) > Math.abs(@_yDiff)
			if @_xDiff > 0
				@_onLeft()
			else
				@_onRight()
		else
			if @_yDiff > 0
				@_onUp()
			else
				@_onDown()
		
		@_xDown = null
		@_yDown = null
		@trigger GestureUtils.ON_TOUCH_END, event

	###*
	@method getTouchPositions
	@static
	@param {Event} evt
	@return {Array}
	###	
	@getTouchPositions:(evt)->
		if evt.touches
			touches = evt.touches
		else
			touches = [{pageX: evt.pageX, pageY: evt.pageY}]
		i = touches.length
		tPos = []
		sl = document.body.scrollLeft
		st = document.body.scrollTop
		while i-- > 0
			tPos[i] = [touches[i].pageX - sl, touches[i].pageY - st]
		return tPos

