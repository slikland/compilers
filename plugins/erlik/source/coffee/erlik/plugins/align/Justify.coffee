#import erlik.plugins.Plugin
#namespace slikland.erlik.plugins.align

class Justify extends slikland.erlik.plugins.Plugin
	_toolbar: {
		icon: 'fa-align-justify'
		toggle: true
	}

	_styleValidation: 'justify'
	_style: 'text-align'

	_command: 'justifyFull'
	