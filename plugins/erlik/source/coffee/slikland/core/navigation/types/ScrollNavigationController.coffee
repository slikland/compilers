#import slikland.core.navigation.BaseNavigationController
#import slikland.utils.ArrayUtils

class ScrollNavigationController extends BaseNavigationController
	constructor: () ->
		super

	@get visibleViews:->
		return @_visibleViews

	@get currentView:->
		return @_currentView

	@get previousView:->
		return @_previousView

	@get data:()->
		return {currentView:@currentView, previousView:@previousView, visibleViews:@_visibleViews}

	start:(p_id=null)->
		if app.config.navigation.options?
			@_options = app.config.navigation.options
		else
			throw new Error('The options object in config.json file must be created to use this navigation, see a example in source code.')
			###
			"navigation":{
				"type":"scroll",
				"options":{
					"orientation":"vertical",
					"scrollToTime":0,
					"showViewPercent":0.5,
					"snap":{
						"delay":0
					}
				}
			}
			###

		@_visibleViews = @_visibleViews || []
		@_autoScrolling = false

		@_orientation = if @_options.orientation? && (@_options.orientation == 'vertical' || @_options.orientation == 'horizontal') then @_options.orientation else 'vertical'
		@_snapDelay = if @_options.snap?.delay? && @_options.snap.delay > 0 then @_options.snap.delay else 0
		@_scrollToTime = if @_options.scrollToTime >= 0 then @_options.scrollToTime else .5
		@_showViewPercent = if @_options.showViewPercent >= 0 || @_options.showViewPercent <= 1 then @_options.showViewPercent else .5

		for k, v of app.config.views
			view = @_views.create(k)
			@_appendToWrapper(view)
			view.createStart()
		
		window.addEventListener "scroll", @_onScroll
		@_onScroll(null)
		
		super(p_id)

	change:(p_id)=>
		# returns if target view is the same
		if @_currentView?.id is p_id then return
		if @_currentView? then @_previousView = @_currentView
		@_currentView = @_views.create(p_id)

		@_scrollToView(p_id)
	
	_onScroll:(evt)=>
		@_visibleViews = @_visibleViews || []
		currentView = null

		for k, v of app.config.views
			view = @_views.create(k)
			
			view_bounds = (if @_orientation == 'vertical' then view.height + view.element.offsetTop else view.width + view.element.offsetLeft) - @_getScrollValue

			if @_isVisible(view)
				if @_visibleViews.indexOf(view) < 0 then @_visibleViews.push view
			else
				index = @_visibleViews.indexOf(view)
				if index >= 0 then ArrayUtils.removeItemByIndex(index, @_visibleViews)

			
			if view_bounds > ((if @_orientation == 'vertical' then window.innerHeight else window.innerWidth)*@_showViewPercent) and currentView == null
				currentView = view
				@_snapping(view)

				if @_currentView?.id is view.id then continue
				if @_currentView? then @_previousView = @_currentView
				@_currentView = @_views.create(view.id)

				@_show(view)
			else
				view.pause()			
		
	_isVisible:(p_view)=>
		if @_orientation == 'vertical'
			elementTop = p_view.element.offsetTop
			elementBottom = elementTop + p_view.height
			return (@_getScrollValue + window.innerHeight) > elementTop && @_getScrollValue + window.innerHeight < (elementBottom + window.innerHeight)
		else
			elementLeft = p_view.element.offsetLeft
			elementRight = elementLeft + p_view.width
			return (@_getScrollValue + window.innerWidth) > elementLeft && @_getScrollValue + window.innerWidth < (elementRight + window.innerWidth)

	_snapping:(p_view)=>
		if !@_autoScrolling && @_snapDelay > 0
			TweenMax.killDelayedCallsTo @_scrollToView
			TweenMax.delayedCall @_snapDelay, @_scrollToView, [p_view.id]

	_show:(p_view)=>
		@trigger(BaseNavigationController.CHANGE_VIEW, {data:@data})
		if p_view.showed then p_view.resume() else p_view.showStart()

	_scrollToView:(p_id)=>
		view = @_views.create(p_id)

		TweenMax.killTweensOf window
		if @_orientation == 'vertical'
			TweenMax.to window, @_scrollToTime, {
				scrollTo:{
					y:view.element.offsetTop, 
					onAutoKill:@_onAutoKill
				}, 
				ease:Quad.easeOut, 
				onStart:@_onStartAutoScroll, 
				onComplete:@_onCompleteAutoScroll
			};
		else
			TweenMax.to window, @_scrollToTime, {
				scrollTo:{
					x:view.element.offsetLeft, 
					onAutoKill:@_onAutoKill
				}, 
				ease:Quad.easeOut, 
				onStart:@_onStartAutoScroll, 
				onComplete:@_onCompleteAutoScroll
			};

		TweenMax.killDelayedCallsTo @_show
		TweenMax.delayedCall @_scrollToTime, @_show, [view]		

	_onStartAutoScroll:()=>
		@_autoScrolling = true
	
	_onCompleteAutoScroll:()=>
		@_autoScrolling = false

	_onAutoKill:(event)=>
		@_autoScrolling = false

	@get _getScrollValue:->
		if @_orientation == 'vertical'
			if typeof pageYOffset != 'undefined'
				return pageYOffset
			else
				B = document.body
				D = document.documentElement
				D = if D.clientHeight then D else B
				return D.scrollTop
		else
			if typeof pageXOffset != 'undefined'
				return pageXOffset
			else
				B = document.body
				D = document.documentElement
				D = if D.clientWidth then D else B
				return D.scrollLeft
