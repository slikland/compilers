#import erlik.plugins.Plugin
#namespace slikland.erlik.plugins.format

class Underline extends slikland.erlik.plugins.Plugin
	_toolbar: {
		icon: 'fa-underline'
		toggle: true
	}

	_styleValidation: 'underline'
	_style: 'text-decoration'
	_validateParentStyles: true

	_command: 'underline'
