paths:
	root: '../'
	deploy: '{paths.root}deploy/'
	source: '{paths.root}source/'
sourcePaths: [
	'{paths.source}'
]
tasks:
	preloader:
		src: 'Main.coffee'
		output: '{paths.deploy}gaap.js'
		ignorePackage: 'slikland'
		isNode: true
	# framework: 
	# 	'slikland'
	# preloaderCss:
	# 	src: '{paths.source}less/test.less'
	# 	output: '{paths.deploy}test.css'
	# vendors:
	# 	src: 'imports.js'
	# 	output: '{paths.deploy}js/vendors.js'
		# options:
		# 	bare: true
# 		includes:
# 			'Test.coffee'
# 	main:
# 		src: 'Main.coffee'
# 		output: '{paths.deploy}js/Main.js'
# 		includes:
# 			'Test.coffee'
# 		depends: 'preloader'
# options:
# 	coffee:
# 		bare: true

docs:
	name: "Test Project Name"
	description: "Test Project description"
	version: "1.0"
	url: "http://slikland.com/"
	logo: "http://slikland.com/media/images/logo_docs.png"
	source: "{paths.source}"
	options:
		paths: ["{paths.source}core/"]
		output: "../../docs"
