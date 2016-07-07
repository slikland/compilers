#import slikland.core.navigation.NavigationRouter
#import slikland.core.navigation.MetaController


class Navigation extends EventDispatcher

	@CHANGE_ROUTE : 'navigation_change_route'
	@CHANGE_VIEW : 'navigation_change_view'
	@CHANGE_INTERNAL_VIEW : 'navigation_change_internal_view'

	_controller = null
	_router = null
	_meta = null

	constructor: (p_controller = null) ->

		if !(p_controller instanceof BaseNavigationController) then throw new Error('The instance of '+p_controller+' class is not either BaseNavigationController class')
		_controller = p_controller

		_router = new NavigationRouter()
		_meta = new MetaController()
		
		app.navigation = @
		super

	setup:(p_data)=>
		_controller.on(BaseNavigationController.CHANGE, @_navigationChange)
		_controller.on(BaseNavigationController.CHANGE_VIEW, @_navigationChange)
		_controller.setup(p_data)

		_router.on(NavigationRouter.CHANGE, @_routeChange)
		_router.on(NavigationRouter.CHANGE_ROUTE, @_routeChange)
		_router.setup(app.root, app.config.navigation?.forceHashBang)
		
		for k, v of p_data.views
			if v.route? then _router.addRoute(v.route)

		if app.config.navigation?.autoStart || app.config.navigation?.autoStart is undefined
			@start()
		false

	start:(evt=null)=>
		viewID = null
		pathData = _router._parsePath(_router.getCurrentPath())
		routes = _router._checkRoutes(pathData.path)[0]
		if routes.length > 0
			current = routes[0].route
			viewID =  @_getViewByRoute(current)
		else
			viewID = null
		_controller.start(viewID)
		false
	
	gotoDefault:()=>
		if app.config.navigation?.defaultView? then @goto(app.config.navigation?.defaultView)
		false

	@get visibleViews:->
		return @_visibleViews || _controller.visibleViews

	@get currentView:->
		view = @_currentView || _controller.currentView
		view.routeData = @routeData
		return view

	@get previousView:->
		return @_previousView || _controller.previousView

	@get routeData:()->
		pathData = _router._parsePath(_router.getCurrentPath())
		routeData = _router._checkRoutes(pathData.path)

		results = {}
		if routeData?
			results.raw = pathData.rawPath
			results.params = pathData.params
			results.route = routeData[0]?[0]?.route
			results.parsed = routeData[1]
		return results

	setRoute:(p_value, p_trigger=false)=>
		@gotoRoute(p_value, p_trigger)
		false

	gotoRoute:(p_value, p_trigger=false)=>
		return if !p_value?
		if p_value.indexOf('/') == 0
			_router.goto(p_value, p_trigger)
		else
			throw new Error('The value "'+p_value+'" is not a valid format to route ("/example")')
		false

	# DEPRECATED
	goto:(p_value)=>
		if p_value.indexOf('/') == 0
			@gotoRoute(p_value)
		else
			@gotoView(p_value)
		false
	# 
	gotoView:(p_value)=>
		if p_value.indexOf('/') == 0
			throw new Error('The value "'+p_value+'" is not a valid format to viewID ("exampleID")')
		else
			_controller.goto(p_value)
		false

	_getViewByRoute:(p_value)=>
		for k, view of app.config.views
			if view.route? && view.route is p_value
				return view.id
		return null

	_getRouteByView:(p_value)=>
		for k, view of app.config.views
			if view.route? && view.id is p_value
				return view.route
		return null

	_navigationChange:(evt)=>
		# TODO: @setRoute(@_getRouteByView(@_currentView.id))
		switch evt.type
			when BaseNavigationController.CHANGE_VIEW
				@_currentView = evt.data.currentView
				@_previousView = evt.data.previousView
				@_visibleViews = evt.data.visibleViews
				
				@trigger(Navigation.CHANGE_VIEW, {data:evt.data})
				
				_meta.change(@currentView.meta)
			when BaseNavigationController.CHANGE
				@trigger(Navigation.CHANGE_INTERNAL_VIEW, {view:evt.view, transition:evt.transition})
		false

	_routeChange:(evt=null)=>
		switch evt.type
			# when NavigationRouter.CHANGE
			# 	@trigger(Navigation.CHANGE, {data:@routeData})
			when NavigationRouter.CHANGE_ROUTE
				@trigger(Navigation.CHANGE_ROUTE, {data:@routeData})
				if @routeData.route? then @goto(@_getViewByRoute(@routeData.route))
		return null
