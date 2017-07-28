#import erlik.plugins.Plugin
#namespace slikland.erlik.plugins.align

class Center extends slikland.erlik.plugins.Plugin
	_toolbar: {
		icon: 'fa-align-center'
		toggle: true,
		tooltip: 'Centralizar'
	}

	_styleValidation: 'center'
	_style: 'text-align'

	_command: 'justifyCenter'
	