#import erlik.plugins.Plugin
#namespace slikland.erlik.plugins.align

class Left extends slikland.erlik.plugins.Plugin
	_toolbar: {
		icon: 'fa-align-left'
		toggle: true
	}

	_styleValidation: 'value == "left" || value == "start"'
	_style: 'text-align'

	_command: 'justifyLeft'
	