paths:
	root: '../../'
	source: '{paths.root}source/'
	coffee: '{paths.source}coffee/'
	
sourcePaths: [
]

docs:
	name: "Slikland Framework"
	description: "Slikland Framework"
	version: "1.0"
	url: "http://slikland.com/"
	logo: "http://slikland.com/media/images/logo_docs.png"
	source: "{paths.source}"
	options:
		paths: ["{paths.coffee}"]
		output: "../../docs"
