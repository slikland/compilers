#import slikland.core.navigation.NavigationLoader
#import project.views.TemplatePreloaderView

class Preloader extends NavigationLoader
	constructor:()->
		super(new TemplatePreloaderView())
app.on 'windowLoad', =>
	new Preloader()
	
