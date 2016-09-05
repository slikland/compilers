#import erlik.plugins.Plugin
#namespace slikland.erlik.plugins.media

class Video extends slikland.erlik.plugins.Plugin
	_toolbar: {
		icon: 'fa-film'
		toggle: false
	}

	_command: 'insertElement'
	
	constructor:()->
		super
		@_browser = document.createElement('input')
		@_browser.setAttribute('type', 'file')
		@_browser.setAttribute('accept', 'image/*')
		@_browser.style['position'] = 'absolute'
		@_browser.style['left'] = '-100000px'
		@_browser.style['opacity'] = 0
		@_browser.on('change', @_browserChange)
		document.body.appendChild(@_browser)

	_toolbarClick:()=>
		super
		slikland.erlik.ui.Lightbox.open({
			title: 'Media'
		})
		

	class @Element extends BaseDOM
		constructor:(target = null)->
			if !target
				target = 'div'
			super({element: target})
			@element.contentEditable = false
			@attr('tabindex', 0)			
			@addClass('media-item')
			@element.on('click', @_click)
			@element.on('focus', @_focus)
			@element.on('dblclick', @_dblCick)
		_click:()=>
			@_element.focus()
		_focus:()=>
			@trigger('focus')
		_dblCick:()=>
			console.log('edit', @)

	# _toolbarClick:()=>
	# 	@_browser.click()

	# _browserChange:()=>
	# 	console.log(@_browser.files)


	# update:(styles)->
	# 	for style in styles
	# 		value = style[@_style]
	# 		break
	# 	@_setValue(value)
	# _toolbarClick:()=>
	# 	@_picker.click()

	# _pickerChange:()=>
	# 	@_value = @_picker.value
	# 	@_triggerChange()

	# _setValue:(color)->
	# 	rgbFormat = /rgba?\(([\d\.]+),.*?([\d\.]+),.*?([\d\.]+).*?\)/
	# 	if rgbFormat.test(color)
	# 		o = rgbFormat.exec(color)
	# 		r = Number(o[1]).toString(16).padLeft(2, '0')
	# 		g = Number(o[2]).toString(16).padLeft(2, '0')
	# 		b = Number(o[3]).toString(16).padLeft(2, '0')
	# 		color = '#' + r + g + b
	# 	@_picker.value = @_value = color
	# 	@_toolbarUI?.css?('color', color)
