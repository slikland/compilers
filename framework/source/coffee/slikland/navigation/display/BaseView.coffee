#import slikland.display.BaseDOM
###*
Base View
@class BaseView
@extends BaseDOM
###

class BaseView extends BaseDOM

	###*
	Triggered before the create rotine view starts. Triggered when {{#crossLink "BaseView/createStart:method"}}{{/crossLink}} is called.
	@event CREATE_START
	@static
	###
	@CREATE_START: 'create_start'
	###*
	Triggered when the create rotine view starts. Triggered when {{#crossLink "BaseView/create:method"}}{{/crossLink}} is called.
	@event CREATE
	@static
	###
	@CREATE: 'create'
	###*
	Triggered when the create rotine view is finished. Triggered when {{#crossLink "BaseView/createComplete:method"}}{{/crossLink}} is called.
	@event CREATE_COMPLETE
	@static
	###
	@CREATE_COMPLETE: 'create_complete'

	###*
	Triggered before the show rotine view starts. Triggered when {{#crossLink "BaseView/showStart:method"}}{{/crossLink}} is called.
	@event SHOW_START
	@static
	###
	@SHOW_START: 'show_start'
	###*
	Triggered when the show rotine view starts. Triggered when {{#crossLink "BaseView/show:method"}}{{/crossLink}} is called.
	@event SHOW
	@static
	###
	@SHOW: 'show'
	###*
	Triggered when the show rotine view is finished. Triggered when {{#crossLink "BaseView/showComplete:method"}}{{/crossLink}} is called.
	@event SHOW_COMPLETE
	@static
	###
	@SHOW_COMPLETE: 'show_complete'

	###*
	Triggered before the hide rotine view starts. Triggered when {{#crossLink "BaseView/hideStart:method"}}{{/crossLink}} is called.
	@event HIDE_START
	@static
	###
	@HIDE_START: 'hide_start'
	###*
	Triggered when the hide rotine view starts. Triggered when {{#crossLink "BaseView/hide:method"}}{{/crossLink}} is called.
	@event HIDE
	@static
	###
	@HIDE: 'hide'
	###*
	Triggered when the hide rotine view is finished. Triggered when {{#crossLink "BaseView/hideComplete:method"}}{{/crossLink}} is called.
	@event HIDE_COMPLETE
	@static
	###
	@HIDE_COMPLETE: 'hide_complete'

	###*
	Triggered when the destroy rotine view starts. Triggered when {{#crossLink "BaseView/destroy:method"}}{{/crossLink}} is called.
	@event DESTROY
	@static
	###
	@DESTROY: 'destroy'
	###*
	Triggered when the destroy rotine view is finished. Triggered when {{#crossLink "BaseView/destroyComplete:method"}}{{/crossLink}} is called.
	@event DESTROY_COMPLETE
	@static
	###
	@DESTROY_COMPLETE: 'destroy_complete'

	###*
	Triggered when the view pauses. Usually when {{#crossLink "BaseView/pause:method"}}{{/crossLink}} is called.
	@event PAUSE
	@static
	###
	@PAUSE: 'pause'
	###*
	Triggered when the view resumes. Usually when {{#crossLink "BaseView/resume:method"}}{{/crossLink}} is called.
	@event RESUME
	@static
	###
	@RESUME: 'resume'

	###*
	@class BaseView
	@constructor	
	@param {Object} [p_data=null] 
	If this data configuration it's not null, some default values is required explained below:
	Key Name|Type|Required
	-|-|-
	id|{{#crossLink "String"}}{{/crossLink}}|__Yes__
	class|{{#crossLink "String"}}{{/crossLink}}|__Yes__
	route|{{#crossLink "String"}}{{/crossLink}}|__No__
	content|{{#crossLink "String"}}{{/crossLink}} / {{#crossLink "JSON"}}{{/crossLink}}|__No__
	cache|{{#crossLink "Boolean"}}{{/crossLink}}|__No__
	parentView|{{#crossLink "String"}}{{/crossLink}}|__No__
	destroyable|{{#crossLink "Boolean"}}{{/crossLink}}|__No__
	loadContent|{{#crossLink "Boolean"}}{{/crossLink}}|__No__
	subviewsWrapper|<a href="https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Getting_Started/Selectors" target="_blank" class="crosslink">Selectors</a>|__No__
	attachToParentWrapper|<a href="https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Getting_Started/Selectors" target="_blank" class="crosslink">Selectors</a>|__No__
	@example
	```
	{
		"id":"home",
		"class":"template-home-view",
		"route":"/",
		"content":"data/home.json",
		"cache":true,
		"parentView":"someViewID",
		"destroyable":true,
		"loadContent":true,
		"subviewsWrapper":"CSSSelector", //like #ID or .className etc
		"attachToParentWrapper":"CSSSelector" //like #ID or .className etc
	}
	```
	@param {Object} [p_CSSClassName=null]
	###
	constructor: (p_data=null, p_CSSClassName=null) ->
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

		super({element:'div', className:p_CSSClassName})

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
