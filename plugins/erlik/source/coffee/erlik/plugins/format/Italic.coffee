#import erlik.plugins.Plugin
#namespace slikland.erlik.plugins.format

class Italic extends slikland.erlik.plugins.Plugin
	_toolbar: {
		icon: 'fa-italic'
		toggle: true
	}

	_styleValidation: 'italic'
	_style: 'font-style'

	_command: 'italic'
