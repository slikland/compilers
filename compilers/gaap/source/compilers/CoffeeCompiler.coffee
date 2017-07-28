class CoffeeCompiler
	@_ADD_NAMESPACE_FN: 'function __addNamespace(scope, obj){for(k in obj){if(!scope){eval(k + " = {};");scope = eval("(function(){return \'+k+\';})();");__addNamespace(scope, obj[k])}else if(!scope[k]){scope[k] = {};__addNamespace(scope[k], obj[k])};}};'

	@_REWRITE_CS_FUNCTIONS: {
		__bind: 'function(fn, me){ return function(){ return fn.apply(me, arguments); }; }'
		__hasProp: '{}.hasOwnProperty'
		__indexOf: '[].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; }'
		__extends: 'function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) Object.defineProperty(child, key, Object.getOwnPropertyDescriptor(parent, key)); } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; }'
	}

	constructor:()->
		@_cache = {}
		@_tasks = []
		@_usedFiles = []
		@_running = false
		@ugly = false
		# Notifier.notify("UHU", 123)

	addTask:(name, task)->
		@_tasks[@_tasks.length] = new Task(name, task)

	start:(sourcePaths = [])->
		if @_running
			return

		@_sourcePaths = sourcePaths

		@_running = true
		@_runTasks()
	stop:()->
		if !@_running
			return
		@_running = false
	reset:()->
		1
	update:(file)->
		if @_cache[file]
			@_cache[file].update()
		else
			@_cache[file] = new File(file)
		if @_running
			@_runTasks(file)
	remove:(files)->
		files = [].concat(files)
		i = files.length
		while i-- > 0
			file = files[i]
			if @_cache[file]
				@_cache[file].dispose()
				delete @_cache[file]
		@_runTasks()
	runTasks:(ugly = false, version = null)->
		@_runTasks(null, ugly, version)

	_runTasks:(file = null, ugly = false, version = null)->
		ugly = ugly
		@_initTime = new Date().getTime()
		@_updateTasks()

		Log.println()

		i = @_tasks.length
		c = 0
		while i-- > 0
			files = @_filterTask(@_tasks[i])
			if file
				if files.indexOf(file) >= 0
					c++
					@_tasks[i].output(ugly, version)
			else
				c++
				@_tasks[i].output(ugly, version)
		if c > 0
			t = ((new Date().getTime() - @_initTime) * 0.001).toFixed(3)
			Log.setStyle('cyan')
			Log.println('In: ' + t + 's')
			Notifier.notify('Compiler', 'Coffee compilation completed!')

	_updateTasks:()->
		i = @_tasks.length
		while i-- > 0
			@_tasks[i].filtered = false
			@_tasks[i].usedBy = {}
			@_tasks[i].update(@_cache, @_sourcePaths)
	_findTask:(name)->
		i = @_tasks.length
		while i-- > 0
			if @_tasks[i].name == name
				return @_tasks[i]
		return null
	_filterTask:(task)->
		if task.filtered
			return task.filteredFiles
		files = task.usedFiles
		if task.depends
			i = task.depends.length
			while i-- > 0
				t = @_findTask(task.depends[i])
				if !t
					continue
				usedFiles = @_filterTask(t)
				j = usedFiles.length
				while j-- > 0
					if (k = files.indexOf(usedFiles[j])) >= 0
						files.splice(k, 1)
		task.filtered = true
		task.filteredFiles = files
		i = -1
		l = files.length
		namespaces = {}
		hasNamespaces = false
		source = ''
		while ++i < l
			c = @_cache[files[i]]
			if c
				if @_addNamespaces(c.namespaces, namespaces)
					hasNamespaces = true
				source += c.js + '\n'
		if hasNamespaces
			source = @constructor._ADD_NAMESPACE_FN + '\n' + '__addNamespace(null, '+JSON.stringify(namespaces)+');\n' + source
		source = @_rewriteCsFuncs(source)
		if !task.bare
			source = '(function() {\n' + source + '}).call(this);'
		task.rawSource = source
		return files

	_rewriteCsFuncs:(source)->
		s = source
		fs = []
		for k, v of @constructor._REWRITE_CS_FUNCTIONS
			re = new RegExp('^\\s*' + k + '\\s*=.*?(,|;)\\s*$', 'gm')
			s = s.replace(re, '$1')
			fs.push(k + '=' + v)
		s = s.replace(/^\s*,?(;)?\s*\n/gm, '$1')
		s = s.replace(/,\s*\n\s*;/g, ';\n')
		if fs.length > 0
			s = 'var ' + fs.join(',\n') + ';\n' + s
		return s

	_addNamespaces:(namespaces, nsObj)->
		added = false
		for ns in namespaces
			ns = ns.split('.')
			for n in ns
				if !nsObj[n]
					nsObj[n] = {}
					added = true
				nsObj = nsObj[n]
		return added

	parseFile:()->

	fileChanged:()->


	class Task
		constructor:(@name, @data)->
			@usedFiles = []
			@bare = @data.options?.bare
			@isNode = @data.isNode
			if @data.depends
				@depends = [].concat(@data.depends)
			# Log.setColors('red')
			# Log.print(@data.src + ' not found')
		update:(cache, sourcePaths)->
			@usedFiles.length = 0
			src = @data.src
			files = []
			if @data.includes
				files = files.concat([].concat(@data.includes))
			files.push(@data.src)
			for k, v of cache
				v.usedBy = {}
			usedFiles = @_parseFilesRecursive(cache, sourcePaths, files)
			if Main.verbose
				console.log(usedFiles.join('\n'))
			@usedFiles = @_removeDuplicates(usedFiles)

		output:(ugly = false, version=null)->
			out = null

			Log.setStyle('magenta')
			Log.print('Compiling ' + @name)
			if ugly
				Log.setStyle('yellow')
				Log.print(' minified')
			Log.println()

			versioner = new Versioner(@data.output)
			
			p = path.resolve(@data.output)
			dir = path.dirname(p)
			if !fs.existsSync(dir)
				@_mkdir(dir)
			
			if versioner.versionRegex.test(@rawSource)
				results = versioner.nextVersion(version)
			
			if results
				@rawSource = @rawSource.replace(versioner.versionRegex, results[0])
				@rawSource = @rawSource.replace(versioner.dateRegex, results[1])
			out = @rawSource

			if ugly
				try
					out = uglify.minify(out, {fromString: true, comments:true}).code
				catch e
					console.log(e)

			if @isNode
				out = '#!/usr/bin/env node\n' + out
			
			fs.writeFileSync(p, out, {encoding: 'utf-8'})
			Log.setStyle('green')
			Log.print('Saved to: ')
			Log.setStyle('magenta')
			Log.println(@data.output)


		_mkdir:(dir)->
			d = path.dirname(dir)
			if !fs.existsSync(d)
				@_mkdir(d)
			fs.mkdirSync(dir)

		_removeDuplicates:(files)->
			usedFiles = {}
			filteredFiles = []
			p = 0
			i = -1
			l = files.length
			while ++i < l
				f = files[i]
				if !usedFiles[f]
					usedFiles[f] = true
					filteredFiles[p++] = f
			return filteredFiles
		_parseFilesRecursive:(cache, sourcePaths, files)->
			prepends = []
			appends = []
			usedFiles = []
			files = [].concat(files)

			_files = [].concat(files)
			i = _files.length
			while i-- > 0
				if _files[i].indexOf('*') >= 0
					tp = _files[i].replace(/\./g, '\\.').replace(/\*/g, '.*?')
					l2 = sourcePaths.length
					i2 = -1
					while ++i2 < l2
						p = path.resolve(sourcePaths[i2]) + '/' + tp
						p = new RegExp(p, 'ig')
						pFiles = []
						j = 0
						found = false
						for k, v of cache
							p.lastIndex = 0
							if p.test(k)
								found = true
								pFiles[j++] = k
						pFiles.unshift(i, 1)
						_files.splice.apply(_files, pFiles)
						if found
							break
			files = _files
			i1 = -1
			l1 = files.length
			while ++i1 < l1
				i2 = -1
				l2 = sourcePaths.length
				found = false
				while ++i2 < l2
					p = files[i1]
					if !/^\//.test(p)
						p = path.resolve(sourcePaths[i2] + p)
					if cache[p]
						found = true

						if cache[p].usedBy[@name]
							usedFiles = [].concat(cache[p].usedBy[@name], usedFiles)
							break
						usedFiles = [].concat(usedFiles, @_parseFilesRecursive(cache, sourcePaths, cache[p].prepend, p))
						usedFiles[usedFiles.length] = p
						usedFiles = [].concat(usedFiles, @_parseFilesRecursive(cache, sourcePaths, cache[p].append, p))
						cache[p].usedBy[@name] = usedFiles
						break
				if !found
					Log.setStyle('red')
					Log.print('Import not found: ')
					Log.setStyle('cyan')
					Log.print(files[i1])
			return usedFiles
	class File
		constructor:(@file)->
			@prepend = []
			@append = []
			@namespaces = []
			@isJS = false
			if fs.existsSync(@file)
				@update()
			else
				throw new Error('File not found: ' + @file)
		update:()->
			if fs.existsSync(@file)
				@content = fs.readFileSync(@file, 'utf8')
				try
					@content = @content.replace(/^(\s*)(.*?)#\s*inject\s+(['|"])?([^\s'"]+)(\3)(.*?)$/mg, @_replaceInjection)
					@parseContent()
					if /\.js$/ig.test(@file)
						@js = @content
					else
						@js = coffee.compile(@content, {bare: true})
				catch e
					Log.setStyle('red')
					Log.print('Error parsing ')
					Log.setStyle('cyan')
					Log.println(@file)
					Log.setStyle('magenta')
					Log.println(e.message + '\nat line ' + (e.location.first_line + 1))
					Notifier.notify('Error compiling', @file)
			else
				throw new Error('File not found: ' + @file)
		parseContent:()->
			importRE = /#\s*(import|\@codekit-(prepend|append)|namespace)\s+(['|"])?([^\s'"]+)(\2)?/g
			pi = ai = 0

			@prepend.length = 0
			@append.length = 0
			@namespaces.length = 0


			while (match = importRE.exec(@content))
				f = match[4]
				switch match[1]
					when 'import', 'codekit'
						if !/\.js$/ig.test(f)
							f = f.replace(/\./g, '/') + '.coffee'
						if match[2] == 'append'
							@append[ai++] = f
						else
							@prepend[pi++] = f
					when 'namespace'
						@namespaces.push(f)
			if (l = @namespaces.length) > 0
				ns = @namespaces[l - 1]
				@content = @content.replace(/^(class\s+)([^\s]+)/gm, '$1' + ns + '.$2')
		_replaceInjection:()=>
			injectFile = path.dirname(@file) + '/' + arguments[4]
			content = ''
			if fs.existsSync(injectFile)
				stat = fs.statSync(injectFile)
				if stat.isFile()
					content = fs.readFileSync(injectFile, 'utf8')
			content = content.replace(/^/gm, arguments[1]).replace(/^\s*/, '').replace(/\s*$/, '')
			content = arguments[1] + arguments[2] + content + arguments[6]
			return content

		dispose:()->
			@prepend.length = 0
			@append.length = 0
			delete @content
			delete @js
			delete @prepend
			delete @append
