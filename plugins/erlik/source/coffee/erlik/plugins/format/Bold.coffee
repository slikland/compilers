#import erlik.plugins.Plugin
#namespace slikland.erlik.plugins.format

class Bold extends slikland.erlik.plugins.Plugin
	_toolbar: {
		icon: 'fa-bold'
		toggle: true
		tooltip: 'negrito'
	}

	_styleValidation: 'value > 500 || value == \'bold\''
	_style: 'font-weight'

	_command: 'bold'
	