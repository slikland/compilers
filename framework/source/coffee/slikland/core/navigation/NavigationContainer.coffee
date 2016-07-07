#import slikland.core.navigation.Navigation
#import slikland.core.navigation.BaseView

class NavigationContainer extends BaseView
	
	constructor: () ->
		super null, 'nav-container'

	setupNavigation:(p_data)=>
		@_navigation = new Navigation(@controller)
		@_navigation.setup(p_data)

	@get navigation:()->
		return @_navigation

	# Override this method (required)
	@get controller:=>
		throw new Error('Override this method with a instance of BaseNavigationController.')
