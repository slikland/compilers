#import slikland.core.navigation.ViewsData


class BaseNavigationController extends EventDispatcher
	@CHANGE : 'base_navigation_controller_change'
	@CHANGE_VIEW : 'base_navigation_controller_change_view'
	@CHANGE_SUBVIEW : 'base_navigation_controller_change_subview'


	constructor: () ->
		super

	setup: (p_data) ->
		@_views = new ViewsData(p_data)
		if app.navigation?.instantiateViews || app.navigation?.instantiateViews is undefined
			@_views.createAll()
		false

	start:(p_id=null)->
		if @_started then throw new Error('The instance of BaseNavigationController already started')
		@_started = true

		if !p_id
			view = app.config.navigation.defaultView
		else
			view = p_id

		@goto(view)
		false
		
	goto:(p_id)->
		if !@_started then throw new Error('The instance of BaseNavigationController is not started')
		@change(p_id)
		false

	# Override this method
	@get type:->
		throw new Error('Override the visibleViews getter in '+@constructor.type+' class')

	# Override this method
	@get visibleViews:->
		throw new Error('Override the visibleViews getter in '+@constructor.name+' class')

	# Override this method
	@get currentView:->
		throw new Error('Override the currentView getter in '+@constructor.name+' class')

	# Override this method
	@get previousView:->
		throw new Error('Override the previousView getter in '+@constructor.name+' class')

	# Override this method
	@get data:->
		throw new Error('Override the data getter in '+@constructor.name+' class')

	# Override this method with super
	change:(p_id)=>
		@trigger(BaseNavigationController.CHANGE_VIEW, {data:@data})
		false
	
	_appendToWrapper:(p_view)=>
		# attach subview to parent
		wrapper = p_view.parentView

		if p_view.parentView.subviewsWrapper?
			if !p_view.attachToParentWrapper?
				# attach subview to default subviews wrapper
				wrapper = p_view.parentView.subviewsWrapper
			else
				# attach subview to particular subviews wrapper
				wrapper = p_view.parentView.find(p_view.attachToParentWrapper)
		
		if !wrapper?
			throw new Error('The instance of wrapper is not attached on the parent view')
		else
			wrapper.appendChild(p_view)
	
	_removeFromWrapper:(p_view)=>
		# remove subview from parent
		wrapper = p_view?.parent || p_view?.parentView

		try
			wrapper?.removeChild(p_view)
		catch err
			console.log err.stack

