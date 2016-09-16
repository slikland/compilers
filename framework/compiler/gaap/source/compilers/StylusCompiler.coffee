class StylusCompiler
	constructor:()->
		@_tasks = []
		@_running = false
		@ugly = false

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
		if @_running
			@_runTasks()
	remove:(files)->
		@_runTasks()
	runTasks:(ugly = false)->
		@_runTasks(null, ugly)
	_runTasks:(file = null, ugly = false)->
		ugly = ugly
		@_initTime = new Date().getTime()

		Log.println()

		i = @_tasks.length
		c = 0
		while i-- > 0
			c++
			@_tasks[i].output(@_sourcePaths, ugly)


	class Task
		constructor:(@name, @data)->
			@usedFiles = []
			@bare = @data.options?.bare
			@isNode = @data.isNode
			if @data.depends
				@depends = [].concat(@data.depends)
		output:(sourcePaths, ugly = false)->
			@_initTime = new Date().getTime()
			Log.setStyle('magenta')
			Log.print('Compiling ' + @name)
			if ugly
				Log.setStyle('yellow')
				Log.print(' minified')
			Log.println()

			p = path.resolve(@data.output)
			dir = path.dirname(p)
			opts = {
				paths: sourcePaths
				filename: path.basename(p)
			}
			if ugly
				opts['compress'] = true

			if !fs.existsSync(dir)
				@_mkdir(dir)
			i = -1
			l = sourcePaths.length
			out = null
			while ++i < l
				psrc = path.resolve(sourcePaths[i] + @data.src)
				if fs.existsSync(psrc)
					# out = fs.readFileSync(psrc, {encoding: 'utf-8'})
					# exec('vendors/stylus/bin/stylus -x --verbose --include-path=' + sourcePaths.join(':') + ' ' + psrc + ' ' + p, @_compiled)
					exec('vendors/stylus/bin/stylus --include-css -u ./vendors/nib -c -I '+sourcePaths.join(':')+' '+psrc+' -o '+p, @_compiled )
					# console.log(a)
					# out = less.render(out, opts, @_compiled)
					break
		_compiled:(error, output, errorMessage)=>
			if error
				Log.setStyle('red')
				Log.print('Error compiling: ')
				Log.setStyle('cyan')
				Log.println(@name)
				process.stdout.write(errorMessage)
				return
			p = path.resolve(@data.output)
			# fs.writeFileSync(p, output.css, {encoding: 'utf-8'})
			Log.setStyle('green')
			Log.print('Saved to: ')
			Log.setStyle('magenta')
			Log.println(@data.output)
			t = ((new Date().getTime() - @_initTime) * 0.001).toFixed(3)
			Log.setStyle('cyan')
			Log.println('In: ' + t + 's')
			Notifier.notify('Compiler', 'Stylus compilation completed!')
		_mkdir:(dir)->
			d = path.dirname(dir)
			if !fs.existsSync(d)
				@_mkdir(d)
			fs.mkdirSync(dir)

