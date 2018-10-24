class JSCompiler
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
	runTasks:(ugly = false)->
		@_runTasks(null, ugly)
	_runTasks:(file = null, ugly = false)->
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
					@_tasks[i].output(ugly)
			else
				c++
				@_tasks[i].output(ugly)
		if c > 0
			t = ((new Date().getTime() - @_initTime) * 0.001).toFixed(3)
			Log.setStyle('cyan')
			Log.println('In: ' + t + 's')
			Notifier.notify('Compiler', 'JS compilation completed!')


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
				j = files.length
				while j-- > 0
					if (k = files.indexOf(usedFiles[j])) >= 0
						files.splice(k, 1)
		task.filtered = true
		task.filteredFiles = files
		i = -1
		l = files.length
		source = ''
		while ++i < l
			c = @_cache[files[i]]
			if c
				source += c.js + '\n'
		if !task.bare
			source = '(function() {\n' + source + '}).call(this);'
		if task.isNode
			source = '#!/usr/bin/env node\n' + source
		task.rawSource = source
		return files

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
			@usedFiles = @_removeDuplicates(usedFiles)
		output:(ugly = false)->
			out = null

			Log.setStyle('magenta')
			Log.print('Compiling ' + @name)
			if ugly
				Log.setStyle('yellow')
				Log.print(' minified')
			Log.println()

			p = path.resolve(@data.output)
			dir = path.dirname(p)
			if !fs.existsSync(dir)
				@_mkdir(dir)
			out = @rawSource
			if ugly
				out = uglify.minify(out, {fromString: true, comments:true}).code
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
			i1 = -1
			l1 = files.length
			# while i1-- > 0
			while ++i1 < l1
				i2 = -1
				l2 = sourcePaths.length
				found = false
				while ++i2 < l2
					p = path.resolve(sourcePaths[i2] + files[i1])
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
					Log.setStyle('red')
					Log.print(' at ')
					Log.setStyle('cyan')
					Log.println(p)
			return usedFiles
	class File
		constructor:(@file)->
			@prepend = []
			@append = []
			if fs.existsSync(@file)
				@update()
			else
				throw new Error('File not found: ' + @file)
		update:()->
			if fs.existsSync(@file)
				@content = fs.readFileSync(@file, 'utf8')
				try
					@js = @content
					@parseContent()
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
			importRE = /(?:#|\/\/)\s*(import|\@codekit-(prepend|append))\s+(['|"])?([^\s'"]+)(\2)?/g
			pi = ai = 0

			@prepend.length = 0
			@append.length = 0

			while (match = importRE.exec(@content))
				f = match[4]
				if match[1] == 'import'
					f = f
				if match[2] == 'append'
					@append[ai++] = f
				else
					@prepend[pi++] = f
		dispose:()->
			@prepend.length = 0
			@append.length = 0
			delete @content
			delete @js
			delete @prepend
			delete @append
