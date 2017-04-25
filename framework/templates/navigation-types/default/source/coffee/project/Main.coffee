#import slikland.navigation.types.DefaultNavigationController
#import slikland.navigation.core.NavigationContainer
#import slikland.navigation.core.data.LanguageData
#import slikland.utils.Resizer

#############################
# IMPORT VIEWS BELLOW 	#
#############################

#import project.views.TemplateHomeView
#import project.views.TemplateSubView

class Main extends NavigationContainer
	_controller = new DefaultNavigationController()
	re = Resizer.getInstance()

	constructor: () ->
		super
		console.log Error().stack

	create:(evt=null)=>
		menu = new BaseDOM()
		menu.className = 'menu'
		@appendChildAt(menu, 0)
		
		# app.navigation.on(Navigation.CHANGE_ROUTE, @change)
		
		for k, v of app.config.views
			@button = new BaseDOM()
			menu.appendChild(@button)
			@button.className = 'menu-button'
			@button.attr({'id':v.id})
			@button.text = v.id
			@button.element.on 'click', @click
		re.on(Resizer.BREAKPOINT_CHANGE, @change)

		# console.log LanguageData.getInstance()

		# console.log "main content:", @content
		# console.log app.detections.os
		super

	change:(evt)->
		console.log evt

	click:(evt)->
		route = app.config.views[evt.srcElement.id].route
		app.navigation.gotoRoute(route, true)
		# console.log route

	@get controller:=>
		return _controller

return new Main()
