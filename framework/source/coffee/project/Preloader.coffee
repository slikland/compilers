#import slikland.core.navigation.NavigationLoader
#import project.views.PreloaderView

class Preloader extends NavigationLoader
	constructor:()->
		super (new PreloaderView())

	preloaderAssetsLoaded:(evt=null)=>
		# console.log "add age gate"
		false

app.on 'windowLoad', =>
	new Preloader()
	
