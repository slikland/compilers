paths:
	root: '../../'
	
	deploy: '{paths.root}deploy/'
	source: '{paths.root}source/'
	
	coffee: '{paths.source}coffee/'
	stylus: '{paths.source}stylus/'
	vendors: '{paths.source}vendors/'
	
sourcePaths: [
	'{paths.coffee}'
	'{paths.stylus}'
	'{paths.vendors}'
]

tasks:
	preloaderJS:
		src: '{paths.coffee}project/Preloader.coffee'
		output: '{paths.deploy}js/preloader.js'
	
	mainJS:
		src: '{paths.coffee}project/Main.coffee'
		output: '{paths.deploy}js/main.js'
		depends: 'preloaderJS'
		
	vendors:
		src: '{paths.vendors}imports.js'
		output: '{paths.deploy}js/vendors.js'
		
	preloaderCSS:
		src: '{paths.stylus}preloader.styl'
		output: '{paths.deploy}css/preloader.css'
	
	mainCSS:
		src: '{paths.stylus}main.styl'
		output: '{paths.deploy}css/main.css'
	
	fontsCSS:
		src: '{paths.stylus}fonts.styl'
		output: '{paths.deploy}css/fonts.css'

docs:
	name: "Test Project Name"
	description: "Test Project description"
	version: "1.0"
	url: "http://slikland.com/"
	logo: "http://slikland.com/media/images/logo_docs.png"
	source: "{paths.source}"
	options:
		paths: ["{paths.coffee}"]
		output: "../../docs"
