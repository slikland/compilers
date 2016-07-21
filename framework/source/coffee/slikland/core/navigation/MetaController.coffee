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

	@set color:(p_color)->
		if p_color?
			if document.querySelector('meta[name=apple-mobile-web-app-capable]')?
				document.querySelector('meta[name=apple-mobile-web-app-capable]').content = 'yes'
			else
				meta = document.createElement('meta')
				@head.appendChild(meta)
				meta.name = 'apple-mobile-web-app-capable'
				meta.content = 'yes'

			if document.querySelector('meta[name=mobile-web-app-capable]')?
				document.querySelector('meta[name=mobile-web-app-capable]').content = 'yes'
			else
				meta = document.createElement('meta')
				@head.appendChild(meta)
				meta.name = 'mobile-web-app-capable'
				meta.content = 'yes'

			# Chrome
			if document.querySelector('meta[name=theme-color]')?
				document.querySelector('meta[name=theme-color]').content = p_color
			else
				meta = document.createElement('meta')
				@head.appendChild(meta)
				meta.name = 'theme-color'
				meta.content = p_color

			# Windows Phone
			if document.querySelector('meta[name=msapplication-navbutton-color]')?
				document.querySelector('meta[name=msapplication-navbutton-color]').content = p_color
			else
				meta = document.createElement('meta')
				@head.appendChild(meta)
				meta.name = 'msapplication-navbutton-color'
				meta.content = p_color

			# iOS
			if document.querySelector('meta[name=apple-mobile-web-app-status-bar-style]')?
				document.querySelector('meta[name=apple-mobile-web-app-status-bar-style]').content = 'black-translucent'
			else
				meta = document.createElement('meta')
				@head.appendChild(meta)
				meta.name = 'apple-mobile-web-app-status-bar-style'
				meta.content = 'black-translucent'
