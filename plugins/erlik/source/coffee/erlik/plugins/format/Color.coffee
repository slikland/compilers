#import erlik.plugins.Plugin
#namespace slikland.erlik.plugins.format

class Color extends slikland.erlik.plugins.Plugin
	_toolbar: {
		icon: 'fa-font'
		toggle: false
		tooltip: 'cor'
	}

	_style: 'color'

	_command: 'foreColor'
	_value: '#000000'
	constructor:()->
		super
		@_picker = document.createElement('input')
		@_picker.setAttribute('type', 'color')
		@_picker.style['position'] = 'absolute'
		@_picker.style['left'] = '-100000px'
		@_picker.style['opacity'] = 0
		@_picker.on('change', @_pickerChange)
		document.body.appendChild(@_picker)

	update:(styles)->
		for style in styles
			value = style[@_style]
			break
		@_setValue(value)
	_toolbarClick:()=>
		@_picker.click()

	_pickerChange:()=>
		@_value = @_picker.value
		@_triggerChange()

	_setValue:(color)->
		rgbFormat = /rgba?\(([\d\.]+),.*?([\d\.]+),.*?([\d\.]+).*?\)/
		hexFormat = /^\#(?:[a-f\d]{3}){1,2}$/i
		if rgbFormat.test(color)
			o = rgbFormat.exec(color)
			r = Number(o[1]).toString(16).padLeft(2, '0')
			g = Number(o[2]).toString(16).padLeft(2, '0')
			b = Number(o[3]).toString(16).padLeft(2, '0')
			color = '#' + r + g + b
		if !hexFormat.test(color)
			return
		@_picker.value = @_value = color
		@_toolbarUI?.css?('color', color)
