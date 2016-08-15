#import erlik.plugins.Plugin
#namespace slikland.erlik.plugins.format

class Strikethrough extends slikland.erlik.plugins.Plugin
	_toolbar: {
		icon: 'fa-strikethrough'
		toggle: true
	}

	_styleValidation: 'line-through'
	_style: 'text-decoration'
	_validateParentStyles: true

	_command: 'Strikethrough'
