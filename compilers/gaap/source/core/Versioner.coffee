class Versioner extends EventDispatcher
	running = false
	path = null
	resultVersion = null
	resultDate = null
	versionRegex : /(SL_PROJECT_VERSION):\d+\.\d+\.\d+/g
	dateRegex : /(SL_PROJECT_DATE):[\d]+/g

	constructor: (p_path) ->
		path = p_path
		@_versioning = false
		@readFile(p_path)
		super

	isVersioning:()->
		return @_versioning

	getSource:()->
		return @_source
	
	notify:(p_text, p_color=null)=>
		if p_color? then Log.setStyle(p_color)
		Log.print(p_text)
		Log.println()
		Log.println()

	readFile:(p_path)=>
		return if !@hasFile() || @running

		try
			@running = true
			@_source = data = fs.readFileSync(p_path, 'utf8')
		catch err
			@_versioning = false
			@_source = null
			@notify(err, 'magenta')

		if @versionRegex.test(data)
			resultVersion = String(data.match(@versionRegex))
			resultDate = String(data.match(@dateRegex))
			@_versioning = true
		@running = false
		return data

	nextVersion:(p_type)=>
		if !resultVersion || @running
			return null
		
		@running = true
		version = resultVersion.replace('SL_PROJECT_VERSION:', '')
		now = resultDate.replace('SL_PROJECT_DATE:', '')
		values = version.split('.')

		release = parseInt(values[0])
		build = parseInt(values[1])
		bugfix = parseInt(values[2])

		switch p_type
			when 'release'
				release += 1
				build = 0
				bugfix = 0
				now = Date.now()
			when 'build'
				build += 1
				bugfix = 0
				now = Date.now()
			when 'bugfix'
				bugfix += 1
				now = Date.now()

		resultDate = 'SL_PROJECT_DATE:' + now
		resultVersion = 'SL_PROJECT_VERSION:' + release + '.' + build + '.' + bugfix
		@notify('Current version: '+release + '.' + build + '.' + bugfix, 'yellow')
		@running = false
		return [resultVersion, resultDate]

	hasFile:()->
		try
			@running = true
			result = fs.statSync(path)
			if result? && result.isFile()
				@running = false
				return true
		catch err
			# @notify(err, 'magenta')
		return false

	destroy:()->
		@running = false
		@_source = null
		delete @_source
		@_versioning = null
		delete @_versioning

