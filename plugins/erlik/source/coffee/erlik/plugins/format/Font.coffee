#import erlik.plugins.Plugin
#namespace slikland.erlik.plugins.format

class Font extends slikland.erlik.plugins.Plugin
	constructor:()->
		super

	_buildToolbarUI:()=>
		@_toolbarUI = new BaseDOM({element: 'select'})


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
