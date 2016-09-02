framework:
	root: '../../../../../'
	source: '{framework.root}source/'
	coffee: '{framework.source}coffee/'
	
project:
	root: '../../'
	deploy: '{project.root}deploy/'
	config: '{project.deploy}data/config.json'
	source: '{project.root}source/'
	coffee: '{project.source}coffee/'
	stylus: '{project.source}stylus/'
	vendors: '{project.source}vendors/'
	
sourcePaths: [
	'{framework.coffee}'
	'{project.coffee}'
	'{project.stylus}'
	'{project.vendors}'
]

tasks:
	preloaderJS:
		src: '{project.coffee}project/Preloader.coffee'
		output: '{project.deploy}js/preloader.js'
	
	mainJS:
		src: '{project.coffee}project/Main.coffee'
		output: '{project.deploy}js/main.js'
		depends: 'preloaderJS'
		
	vendors:
		src: '{project.vendors}imports.js'
		output: '{project.deploy}js/vendors.js'
		
	preloaderCSS:
		src: '{project.stylus}preloader.styl'
		output: '{project.deploy}css/preloader.css'
	
	mainCSS:
		src: '{project.stylus}main.styl'
		output: '{project.deploy}css/main.css'
	
	fontsCSS:
		src: '{project.stylus}fonts.styl'
		output: '{project.deploy}css/fonts.css'
