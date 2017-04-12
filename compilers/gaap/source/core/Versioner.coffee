class Versioner extends EventDispatcher
	running = false
	path = null
	resultVersion = null
	resultDate = null
	versionRegex : /(SL_PROJECT_VERSION):\d+\.\d+\.\d+/g
	dateRegex : /(SL_PROJECT_DATE):[\d]+/g

	constructor: (p_path) ->
		path = p_path
		@readFile(p_path)
		super
	
	notify:(p_text, p_color=null)=>
		Log.println()
		if p_color? then Log.setStyle(p_color)
		Log.print(p_text)
		Log.println()

	readFile:(p_path)=>
		return if !@hasFile() || @running

		try
			@running = true
			data = fs.readFileSync(p_path, 'utf8')
		catch err
			@notify(err, 'magenta')

		if @versionRegex.test(data)
			resultVersion = String(data.match(@versionRegex))
			resultDate = String(data.match(@dateRegex))
		@running = false

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
		@notify('Current project version: '+release + '.' + build + '.' + bugfix, 'yellow')
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

