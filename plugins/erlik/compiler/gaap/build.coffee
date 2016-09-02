paths:
	root: '../../'
	deploy: '{paths.root}deploy/'
	source: '{paths.root}source/'
	coffee: '{paths.source}coffee/'
	stylus: '{paths.source}stylus/'
sourcePaths: [
	'{paths.coffee}'
	'{paths.stylus}'
]
tasks:
	erlik:
		src: 'Erlik.coffee'
		output: '{paths.deploy}js/erlik.js'
	erlikCSS:
		src: 'erlik.styl'
		output: '{paths.stylus}erlik.css'
	standalone:
		src: 'Standalone.coffee'
		output: '{paths.deploy}js/standalone.js'
	embeded:
		src: 'Embeded.coffee'
		output: '{paths.deploy}js/embeded.js'

docs:
	name: "Erlik"
	description: "Erlik - Wysiwyg"
	version: "1.0"
	url: "http://slikland.com/"
	logo: "http://slikland.com/media/images/logo_docs.png"
	source: "{paths.source}"
	exclude: 'utils'
	options:
		paths: ["{paths.source}"]
		output: "../../docs"
