#import erlik.plugins.Plugin
#namespace slikland.erlik.plugins.align

class Indent extends slikland.erlik.plugins.Plugin
	_toolbar: {
		icon: 'fa-indent'
		toggle: false
	}

	# _styleValidation: 'value > 500 || value == \'bold\''
	# _style: 'font-weight'

	_command: 'indent'
	