#import slikland.core.navigation.Navigation
#import slikland.core.navigation.types.DefaultNavigationController
#import slikland.core.navigation.types.ScrollNavigationController

class NavigationContainer extends BaseView

	@DEFAULT_NAVIGATION: "default"
	@SCROLL_NAVIGATION: "scroll"
	
	@controller = null

	constructor: () ->
		super null, 'nav-container'

	setupNavigation:(p_data)=>
		@_navigation = new Navigation(@controller)
		@_navigation.setup(p_data)

	@get navigation:()->
		return @_navigation

	# Override this method (optional)
	@get controller:=>
		if !@controller
			switch app.config.navigation.type
				when @SCROLL_NAVIGATION
					@controller = new ScrollNavigationController()
				when @DEFAULT_NAVIGATION
				else
					@controller = new DefaultNavigationController()
		return @controller
