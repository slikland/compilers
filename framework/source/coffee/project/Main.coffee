#import slikland.core.navigation.types.DefaultNavigationController
#import slikland.core.navigation.NavigationContainer
#
#############################
# 
# IMPORT ALL VIEWS BELLOW
# 
#############################
# 
#import project.views.HomeView
#import project.views.Test1View
#import project.views.Sub1View
#import project.views.Sub2View
#import project.views.Sub3View

#import slikland.utils.SplitTextUtils

class Main extends NavigationContainer
	create:(evt=null)=>
		menu = new BaseDOM()
		@appendChildAt(menu, 0)
		
		app.navigation.on(Navigation.CHANGE_VIEW, @test)
		# app.navigation.on(Navigation.CHANGE_ROUTE, @test)

		for k, v of app.config.views
			color = Math.floor(Math.random()*16777215).toString(16)
			@test = new BaseDOM()
			menu.appendChild(@test)
			@test.text = v.id
			@test.css({
				'width':'50px',
				'height':'25px',
				'display':'inline-block',
				'cursor':'pointer',
				'background-color': '#'+color
			})
			@test.element.on 'click', @go
		super

	test:(evt)->
		console.log ">>>", evt.data

	go:(evt)->
		app.navigation.gotoView(evt.srcElement.innerText)

return new Main()
