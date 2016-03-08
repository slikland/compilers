#import core.EventDispatcher
#import core.Watcher
#import core.Log
#import core.Notifier
# import compilers.*

String::ltrim=(char = null)->
	if !char
		char = '\\s'
	re = new RegExp('^' + char + '*')
	re.global = true
	re.multiline = true
	return this.replace(re, '')
String::rtrim=(char = null)->
	if !char
		char = '\\s'
	re = new RegExp(char + '*$')
	re.global = true
	re.multiline = true
	return this.replace(re, '')
String::trim=(char = null)->
	return this.ltrim(char).rtrim(char)

fs = require('fs')
path = require('path')
coffee = require('./vendors/coffee-script').CoffeeScript
uglify = require('./vendors/uglify-js')
yuidocs = require('./vendors/yuidocjs')
exec = require('child_process').exec

class Main
	constructor:()->
		@docs = false
		@ugly = false
		options = process.argv.splice(2)
		@_buildFile = 'build.coffee'
		for o in options
			switch o
				when 'uglify', 'deploy'
					@ugly = true
				when '-docs'
					@docs = true
			if o.indexOf('.coffee') >= 1
				@_buildFile = o

		@coffeeCompiler = new CoffeeCompiler()
		@coffeeCompiler.ugly = @ugly

		@lessCompiler = new LessCompiler()
		@lessCompiler.ugly = @ugly

		@stylusCompiler = new StylusCompiler()
		@stylusCompiler.ugly = @ugly

		@jsCompiler = new JSCompiler()
		@jsCompiler.ugly = @ugly

		@_watcher = new Watcher()
		@_watcher.on(Watcher.CHANGED, @_fileChanged)
		@_watcher.on(Watcher.ADDED, @_fileChanged)
		@_watcher.on(Watcher.REMOVED, @_fileRemoved)

		@_init()


	_fileChanged:(e, files)=>
		files = [].concat(files)
		for file in files
			if /\.coffee$/i.test(file)
				@coffeeCompiler.update(file)
			else if /\.less$/i.test(file)
				@lessCompiler.update(file)
			else if /\.styl$/i.test(file)
				@stylusCompiler.update(file)
			else if /\.js$/i.test(file)
				@coffeeCompiler?.update(file)
				@jsCompiler.update(file)

	_fileRemoved:(e, files)=>
		files = [].concat(files)
		@coffeeCompiler.remove(files)
		@lessCompiler.remove(files)
		@stylusCompiler.remove(files)
		@jsCompiler.remove(files)

	_onInput:()=>
		data = process.stdin.read()
		if data
			data = data.toString().trim().toLowerCase()
			if data.length == 0
				return
			process.stdout.write('\x1b[T\x1b[J')
			switch data
				when 'compile'
					@coffeeCompiler.runTasks(false)
					@lessCompiler.runTasks(false)
					@stylusCompiler.runTasks(false)
					@jsCompiler.runTasks(false)
				when 'uglify', 'deploy'
					@coffeeCompiler.runTasks(true)
					@lessCompiler.runTasks(true)
					@stylusCompiler.runTasks(true)
					@jsCompiler.runTasks(true)
				# when 'docs'
				# 	@docs = true
				# 	@_buildDocs()
				else
					Log.setStyle('yellow')
					Log.print('No command ')
					Log.setStyle('cyan')
					Log.print(data)
					Log.setStyle('yellow')
					Log.println(' found')
	_init:()->
		@_buildFileChanged()
		process.stdin.on('readable', @_onInput)
		@_buildDocs()

	_reset:()->
		@coffeeCompiler.stop()
		@coffeeCompiler.reset()
		@lessCompiler.stop()
		@lessCompiler.reset()
		@stylusCompiler.stop()
		@stylusCompiler.reset()
		@jsCompiler.stop()
		@jsCompiler.reset()
		@_buildfileWatcher?.close()

	_buildDocs:()=>
		return if !@docs || @docs && !@buildFile?.docs? || !@buildFile?.docs?
		Log.println()
		Log.setStyle('magenta')
		Log.print('Compiling Docs')
		Log.println()

		@buildFile.docs['linkNatives'] = true
		@buildFile.docs['attributesEmit'] = true
		@buildFile.docs['selleck'] = true
		@buildFile.docs['syntaxtype'] = 'coffee'
		@buildFile.docs['extension'] = '.coffee'
		@buildFile.docs['paths'] = @buildFile.docs['source']
		@buildFile.docs['outdir'] = @buildFile.docs['options']['output']

		options = yuidocs.Project.init(yuidocs.clone(@buildFile.docs))
		opts = yuidocs.clone(options)
		if opts.paths && opts.paths.length && (opts.paths.length > 10)
			opts.paths = [].concat(opts.paths.slice(0, 5), ['<paths truncated>'], options.paths.slice(-5))

		json = (new yuidocs.YUIDoc(options)).run()
		if json == null then throw new Error('Running YUIDoc returns null.')
		options = yuidocs.Project.mix(json, options)

		clearTimeout @t
		if options.parseOnly is undefined || !options.parseOnly
			# @t = setTimeout(@_compileDocs, 1500, options, json)
			@_compileDocs options, json

	_compileDocs:(options, json)=>
		# Log.println('>>>>')
		# clearTimeout @t
		builder = new (yuidocs.DocBuilder)(options, json)
		# Log.println('>>>> OKOOKOOKO')
		builder.compile @_buildDocsComplete

	_buildDocsComplete:(p_endtime)=>
		Log.setStyle('cyan')
		Log.println('In: ' + p_endtime + 's')
		Notifier.notify('Compiler', 'Docs compilation completed!')

	_buildFileChanged:()=>
		Log.setStyle('magenta')
		Log.println('Preparing... please wait')
		@_reset()
		@_parseBuildFile()
		@coffeeCompiler.start(@sourcePaths)
		@lessCompiler.start(@sourcePaths)
		@stylusCompiler.start(@sourcePaths)
		@jsCompiler.start(@sourcePaths)
		clearTimeout @tt
		@tt = setTimeout(@_ready, 3000)

	_ready:()=>
		clearTimeout @tt
		Log.setStyle('green')
		Log.println('Ready!')
		Log.println('')
	
	_parseBuildFile:()->
		if fs.existsSync(@_buildFile)
			try
				buildFile = fs.readFileSync(@_buildFile, {encoding: 'utf-8'})
				buildFile = 'return ' + '{' + buildFile + '}'
				@buildFile = eval(coffee.compile(buildFile))
			catch e
				Log.setStyle('red')
				Log.print('Error parsing ')
				Log.setStyle('cyan')
				Log.println(@_buildFile)
				Log.setStyle('blue')
				Log.println(e.message + '\nat line ' + (e.location.first_line + 1))
				process.exit()
		if !@buildFile
			Log.setStyle('red')
			Log.print('Could not load ' + @_buildFile)
			process.exit()
			return
		@buildFile = @_replaceDynamicValues(@buildFile)

		@_buildfileWatcher = fs.watch(@_buildFile, @_buildFileChanged)
		@_parseTasks()
		@sourcePaths = [].concat(@buildFile.sourcePaths)
		@_watchFolders()
	_replaceDynamicValues:(obj)->
		Main._tempObj = obj
		@_tempData = JSON.stringify(obj)
		@_tempData = @_tempData.replace(/\{([^\{\}]+)\}/igm, @__replaceDynamicValues)
		obj = JSON.parse(@_tempData)
		delete Main._tempObj
		delete @_tempData
		return obj
	__replaceDynamicValues:(match, capture, pos, val)=>
		n = capture.split('.')
		v = Main._tempObj
		i = -1
		l = n.length
		while ++i < l
			v = v[n[i]]
			if !v
				break
		if !v
			return match

		Main._tempObj = JSON.parse(JSON.stringify(Main._tempObj).replace(new RegExp(match.replace(/(\W)/g, '\\$1'), 'g'), v))
		return v

	_parseTasks:()->
		for k, task of @buildFile.tasks
			src = task.src
			if /\.coffee$/i.test(src)
				@coffeeCompiler.addTask(k, task)
			else if /\.less$/i.test(src)
				@lessCompiler.addTask(k, task)
			else if /\.styl$/i.test(src)
				@stylusCompiler.addTask(k, task)
			else if /\.js$/i.test(src)
				@jsCompiler.addTask(k, task)
	_resetWatchers:()->
		@_watcher?.removeAll()
	_watchFolders:()->
		@_resetWatchers()
		sourcePaths = [].concat(@buildFile.sourcePaths)
		i = 0
		for p in sourcePaths
			@_watcher.addPath(p, true)
	# _fileChange:()=>
	# 	src = arguments
	# 	if /\.coffee$/i.test(src)
	# 		@coffeeCompiler.addTask(task)
	# 	else if /\.js$/i.test(src)
	# 		1
	# 	else if /\.less$/i.test(src)
	# 		1
		# console.log(arguments)

new Main()
