#import slikland.utils.Prototypes
#import slikland.event.EventDispatcher
#import erlik.core.PluginController
#namespace slikland.erlik.plugins

class Plugin extends EventDispatcher
	@get @, PLUGIN_NAME:()->
		@_pluginName ?= []
		return @_pluginName.join(' ')

	@set @, PLUGIN_NAME:(value)->
		@_pluginName ?= []
		if @_pluginName.indexOf(value) < 0
			@_pluginName.push(value)

	@PLUGIN_NAME: 'erlik_plugin'
		

	# PROCESS ORDER CONSTANTS
	@PROCESS_PRE: -10
	@PROCESS_NORMAL: 0
	@PROCESS_POS: 10

	@PROCESS_ORDER: @PROCESS_NORMAL

	# EVENTS
	@CHANGE: 'erlik_plugin_change'


	# DON'T ALTER THIS LINE. JUST TO CHECK INTERNALY
	@_IS_ERLIK_PLUGIN: true

	# _toolbar: {
	# 	icon: 'some-icon'
	# 	toggle: true/false
	# }
	_toolbar: null

	_styleValidation: null
	_style: null
	_validateParentStyles: false

	_tagValidation: null
	_validateParentTags: false
	
	_command: null
	_value: null
	# icon: null
	# style: null
	# toggle: false

	# selector: null


	constructor:(editor)->
		Plugin.PLUGIN_NAME
		@_editor = editor
		@_editor.on(slikland.Erlik.EDIT_PLUGIN, @_editPlugin)

		if @constructor == slikland.erlik.plugins.Plugin
			throw new Error('Please extend me!')
		@_name = @constructor.NAME

		@_buildToolbarUI()

	@get name:()->
		return @constructor.NAME
		
	@get type:()->
		return 2

	@get toolbarUI:()->
		return @_toolbarUI

	@get command:()->
		return @_command

	@get value:()->
		return @_value

	update:(styles, nodes)->
		@_validate(styles)
	_validate:(styles)->
		if !@_styleValidation
			return
		valid = false
		for style in styles
			value = style[@_style]
			if /[\&\|\=|\!|+]/.test(@_styleValidation)
				valid = eval(@_styleValidation)
			else
				valid = (value == @_styleValidation)
			if valid
				break
			if !@_validateParentStyles
				break
		@_toolbarUI?.value = valid

	_buildToolbarUI:()=>
		if @_toolbar
			@_toolbarUI = new slikland.erlik.ui.Button(@_toolbar)
			@_toolbarUI.on('click', @_toolbarClick)
	_triggerChange:(data = {})->
		@_changeData ?= {}
		for k, v of data
			@_changeData[k] = v
		clearTimeout(@_changeTimeout)
		@_changeTimeout = setTimeout(@_change, 0)

	_change:()=>
		@_changeData['plugin'] = @
		@trigger(@constructor.CHANGE, @_changeData)
		@_changeData = null

	_toolbarClick:()=>
		@_triggerChange()

	_editPlugin:(e, data)=>
		if data instanceof @constructor.Element
			@edit?(data)


	class @Element extends BaseDOM
		constructor:(target = null)->
			if !target
				target = 'div'
			super({element: target})

