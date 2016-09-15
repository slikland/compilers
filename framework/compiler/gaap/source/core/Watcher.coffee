class Watcher extends EventDispatcher
	@CHANGED: 'watcherChanged'
	@ADDED: 'watcherAdded'
	@REMOVED: 'watcherRemoved'

	constructor:()->
		@_paths = []
		@_pathWatcher = {}
	pathExists:(file)->
		if @_pathWatcher[file]
			return true
		return false
	addPath:(file, trigger = false)->
		file = path.resolve(file)
		if @pathExists(file)
			return @_pathWatcher[file]
		w = fs.watch(file, @_pathChange)
		w._parent = @
		w._file = file
		@_paths[@_paths.length] = {file: file, watcher: w}
		@_pathWatcher[file] = w
		if trigger
			stat = fs.statSync(file)
			if stat.isDirectory()
				files = @_parsePaths(file)
				@trigger(Watcher.ADDED, files)
				return files
		return w
	removeAll:()->
		i = @_paths.length
		while i-- > 0
			@_paths[i].watcher.close()
		delete @_pathWatcher
		@_paths.length = 0
		@_pathWatcher = {}
	removePath:(file)->
		i = @_paths.length
		fileRE = file.replace(/(\W)/g, '\\$1')
		fileRE = new RegExp('^' + fileRE, 'g')
		while i-- > 0
			fileRE.lastIndex = 0
			if fileRE.test(@_paths[i].file)
				@_paths[i].watcher.close()
				@_paths.splice(i, 1)
				@_pathWatcher[@_paths[i].file]
				delete @_pathWatcher[@_paths[i].file]
	_parsePaths:(file)->
		file = file.rtrim('/') + '/'
		stat = fs.statSync(file)
		if !stat.isDirectory()
			return
		files = fs.readdirSync(file)
		i = files.length
		fileList = []
		while i-- > 0
			p = file + files[i]
			fileList.push(p)
			stat = fs.statSync(p)
			if !stat.isSymbolicLink() && stat.isDirectory()
				fl = @_parsePaths(p)
				fileList = [].concat(fl, fileList)
		@addPath(file)
		return fileList
	_pathChange:(type, file)->
		parent = @_parent
		file = path.resolve(@_file + '/' + file)
		if fs.existsSync(file)
			parent.trigger(Watcher.CHANGED, file)
			stat = fs.statSync(file)
			if stat.isDirectory()
				parent.addPath(file, true)
		else
			parent.removePath(file)
			parent.trigger(Watcher.REMOVED, file)
