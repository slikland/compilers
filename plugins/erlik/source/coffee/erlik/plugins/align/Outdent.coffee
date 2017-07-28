#import erlik.plugins.Plugin
#namespace slikland.erlik.plugins.list

class Outdent extends slikland.erlik.plugins.Plugin
	_toolbar: {
		icon: 'fa-outdent'
		toggle: false
		tooltip: 'remover tabulação'
	}

	# _styleValidation: 'value > 500 || value == \'bold\''
	# _style: 'font-weight'

	_command: 'outdent'
	