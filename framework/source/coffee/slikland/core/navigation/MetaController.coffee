###*
@class MetaController
@extends EventDispatcher
@final
###
class MetaController extends EventDispatcher

	###*
	@class MetaController
	@constructor
	###
	constructor: () ->
		super
		
	###*
	@method change
	@param {Object} p_data
	###
	change: (p_data) ->
		@title = p_data?.title
		@description = p_data?.description
		@color = p_data?.color
		@favicon = p_data?.favicon
		@viewport = p_data?.viewport
		false

	###*
	@method applyMeta
	@param {String} p_name
	@param {String} p_value
	###
	applyMeta: (p_name, p_value) ->
		if p_value?
			if document.querySelector('meta[name='+p_name+']')?
				document.querySelector('meta[name='+p_name+']').content = p_value
			else
				meta = document.createElement('meta')
				meta.name = p_name
				meta.content = p_value
				@head.appendChild(meta)
		false

	###*
	@attribute head
	@type {HTMLElement}
	@readOnly
	###
	@get head:()->
		return document.head || document.getElementsByTagName('head')[0]

	###*
	@attribute viewport
	@type {String}
	###
	@set viewport:(p_value)->
		@applyMeta('viewport', p_value)

	###*
	@attribute title
	@type {String}
	###
	@set title:(p_value)->
		if p_value?
			document.title = p_value

	###*
	@attribute description
	@type {String}
	###
	@set description:(p_value)->
		@applyMeta('description', p_value)

	###*
	@attribute favicon
	@type {String}
	###
	@set favicon:(p_value)->
		if p_value?
			if document.querySelector('link[rel=icon]')?
				document.querySelector('link[rel=icon]').type = "image/x-icon"
				document.querySelector('link[rel=icon]').href = p_value
			else
				link = document.createElement('link')
				link.rel = "icon"
				link.type = "image/x-icon"
				link.href = p_value
				@head.appendChild(link)
		false

	###*
	@attribute color
	@type {String}
	###
	@set color:(p_color)->
		# All
		@applyMeta('mobile-web-app-capable', 'yes')

		# Chrome
		@applyMeta('theme-color', p_color)

		# Windows Phone
		@applyMeta('msapplication-navbutton-color', p_color)

		# iOS
		@applyMeta('apple-mobile-web-app-capable', 'yes')
		@applyMeta('apple-mobile-web-app-status-bar-style', 'black-translucent')
		false
