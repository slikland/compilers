#import slikland.display.BaseDOM

class BaseView extends BaseDOM

	@CREATE_START: 'create_start'
	@CREATE: 'create'
	@CREATE_COMPLETE: 'create_complete'

	@SHOW_START: 'show_start'
	@SHOW: 'show'
	@SHOW_COMPLETE: 'show_complete'

	@HIDE_START: 'hide_start'
	@HIDE: 'hide'
	@HIDE_COMPLETE: 'hide_complete'

	@DESTROY: 'destroy'
	@DESTROY_COMPLETE: 'destroy_complete'

	@PAUSE: 'pause'
	@RESUME: 'resume'

	constructor: (p_data=null, p_className=null) ->
		@_created = false
		@_showed = false
		
		@data = if p_data then p_data else {}
		@id = if @_data.id? then @_data.id
		@content = if @_data.content? then @_data.content
		@route = if @_data.route? then @_data.route
		@routeData = if !@_routeData then null
		@parentView = if @_data.parentView? then @_data.parentView
		@subviews = if @_data.subviews? then @_data.subviews
		@destroyable = if @_data.destroyable? then @_data.destroyable

		super({element:'div', className:p_className})

	@get loader:->
		return if @_id? then app?.loader?.getGroup(@_id)

	@get created:->
		return @_created

	@get showed:->
		return @_showed

	@get data:->
		return @_data
	@set data:(p_value)->
		@_data = ObjectUtils.clone(p_value)

	@get id:->
		return @_id
	@set id:(p_value)->
		@_id = p_value

	@get content:->
		return @_content
	@set content:(p_value)->
		@_content = p_value

	@get route:->
		return @_route
	@set route:(p_value)->
		@_route = p_value

	@get routeData:->
		return @_routeData
	@set routeData:(p_value)->
		@_routeData = p_value

	@get parentView:->
		return @_parentView
	@set parentView:(p_value)->
		@_parentView = p_value

	@get subviews:->
		return @_subviews
	@set subviews:(p_value)->
		@_subviews = p_value

	@get destroyable:->
		return @_destroyable
	@set destroyable:(p_value)->
		@_destroyable = p_value

	@get type:->
		return @_type
	@set type:(p_value)->
		@_type = p_value

	@get meta:(p_data)->
		return if @_content?.meta? then @_content?.meta

	@get progress:->
		return @_progress
	@set progress:(p_value)->
		@_progress = p_value

	@get reverseParentPath:->
		@getReverseParentList(@)
		return @_parentPath.reverse()

	@get parentPath:->
		@getReverseParentList(@)
		return @_parentPath

	@get subviewsWrapper:()->
		return if @_data?.subviewsWrapper? then @find(@_data.subviewsWrapper)

	@get attachToParentWrapper:()->
		return if @_data?.attachToParentWrapper? then @_data.attachToParentWrapper

	getReverseParentList:(p_subview=null)=>
		@_parentPath = []
		if p_subview?.parentView?
			@getReverseParentList(p_subview.parentView)
			@_parentPath.push p_subview.id
		false

	createStart:(evt=null)=>
		@trigger(BaseView.CREATE_START, @)
		@create()
		false
		
	create:(evt=null)=>
		@trigger(BaseView.CREATE, @)
		@createComplete()
		false

	createComplete:(evt=null)=>
		@_created = true
		@trigger(BaseView.CREATE_COMPLETE, @)
		false
		
	showStart:(evt=null)=>
		@trigger(BaseView.SHOW_START, @)
		@show()
		false

	show:(evt=null)=>
		@trigger(BaseView.SHOW, @)
		@showComplete()
		false

	showComplete:(evt=null)=>
		@_showed = true
		@trigger(BaseView.SHOW_COMPLETE, @)
		false

	hideStart:(evt=null)=>
		@trigger(BaseView.HIDE_START, @)
		@hide()
		false

	hide:(evt=null)=>
		@_showed = false
		@trigger(BaseView.HIDE, @)
		@hideComplete()
		false

	hideComplete:(evt=null)=>
		@trigger(BaseView.HIDE_COMPLETE, @)
		false

	pause:()=>
		@trigger(BaseView.PAUSE, @)
		false

	resume:()=>
		@trigger(BaseView.RESUME, @)
		false
	
	destroy:(evt=null)=>
		@_created = false

		@removeAll()

		@_parentPath?.length = 0
		@_parentPath = null

		@_routeData = null
		@_data = null

		@trigger(BaseView.DESTROY, @)
		@destroyComplete()
		false

	destroyComplete:(evt=null)=>
		@trigger(BaseView.DESTROY_COMPLETE, @)
		@off()
		false
