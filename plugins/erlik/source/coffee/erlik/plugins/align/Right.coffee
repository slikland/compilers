#import erlik.plugins.Plugin
#namespace slikland.erlik.plugins.align

class Right extends slikland.erlik.plugins.Plugin
	_toolbar: {
		icon: 'fa-align-right'
		toggle: true
		tooltip: 'alinhar à\ndireita'
	}

	_styleValidation: 'right'
	_style: 'text-align'

	_command: 'justifyRight'
	