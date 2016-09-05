#import erlik.plugins.Plugin
#namespace slikland.erlik.plugins.list

class OrderedList extends slikland.erlik.plugins.Plugin
	_toolbar: {
		icon: 'fa-list-ol'
		toggle: true
	}

	# _styleValidation: 'value > 500 || value == \'bold\''
	# _style: 'font-weight'

	_command: 'insertOrderedList'
	