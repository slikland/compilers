# TODO:
#	ADD
#	viewports

class MetaController extends EventDispatcher
	constructor: () ->
		super
		
	change: (p_data) ->
		@title = p_data?.title
		@description = p_data?.description
		@favicon = p_data?.favicon

	@get head:()->
		return document.head || document.getElementsByTagName('head')[0]

	@set title:(p_value)->
		if p_value?
			document.title = p_value

	@set description:(p_value)->
		if p_value?
			if document.querySelector('meta[name=description]')?
				document.querySelector('meta[name=description]').content = p_value
			else
				meta = document.createElement('meta')
				@head.appendChild(meta)
				meta.name = 'description'
				meta.content = p_value

	@set favicon:(p_value)->
		if p_value?
			if document.querySelector('link[rel=icon]')?
				document.querySelector('link[rel=icon]').type = "image/x-icon"
				document.querySelector('link[rel=icon]').href = p_value
			else
				link = document.createElement('link')
				@head.appendChild(link)
				link.rel = "icon"
				link.type = "image/x-icon"
				link.href = p_value
