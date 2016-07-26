###*
ViewsData Class
@class ViewsData
@extends EventDispatcher
@final
###
class ViewsData extends EventDispatcher
	@VIEW_CREATED: 'view_created'
	@ALL_VIEWS_CREATED: 'all_views_created'

	###*
	@class ViewsData
	@constructor
	@param {Object} p_data
	###
	constructor: (p_data) ->
		if !p_data? then throw new Error('The param p_data is null')
		@_data = []
		@_views = p_data.views
		super

	getData:(p_id)->
		if !@_views[p_id]? then throw new Error('The view with id "'+p_id+'" does not exists in config file')
		return @_views[p_id]

	get:(p_id)->
		return if @_data[p_id]? then @_data[p_id] else null
		false

	set:(p_view)->
		if !@get(p_view.id)
			@_data[p_view.id] = p_view
		false

	createAll:()->
		for id of @_views
			@create(id)
		@trigger(ViewsData.ALL_VIEWS_CREATED, {views:@_data})
		false

	create:(p_id)->
		if @get(p_id)?
			view = @get(p_id)
		else
			data = @getData(p_id)
			klass = eval(data.class)
			view = new klass(data, data.id+'-view')

		if !view.parentView?
			view.type = 'view'
			view.parentView = app.container
			app.container.subviews ?= {}
			app.container.subviews[view.id] = view
		else
			if typeof view.parentView is 'string' then view.parentView = @get(view.parentView)
		
		if view.subviews?
			for k, v of view.subviews
				subview = @create(v.id)
				subview.type = 'subview'
				subview.parentView = view
				view.subviews[v.id] = subview

		if view.lightbox
			view.type = 'lightbox'

		# TODO: Try fix array content type
		# Ugly workaround to get the subviews more easily the first idea is better =(
		# if !@_data[view.id]? && view.type == 'view'
		@set(view)
		
		@trigger(ViewsData.VIEW_CREATED, {view:view})
		return view

	remove:(p_id)->
		@_data[p_id] = null
		delete @_data[p_id]
		false

	normalize:(p_id)->
		view = @_views[p_id]
		return if view?.parentView? then @normalize(view.parentView) else view?.id
