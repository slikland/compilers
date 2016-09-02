class Versioner extends EventDispatcher
	path = null
	resultVersion = null
	resultDate = null
	versionRegex : /(SL_PROJECT_VERSION):\d.\d.\d/g
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
		return if !@hasFile()

		try
			data = fs.readFileSync(p_path, 'utf8')
		catch err
			@notify(err, 'magenta')

		if @versionRegex.test(data)
			resultVersion = String(data.match(@versionRegex))
			resultDate = String(data.match(@dateRegex))

	nextVersion:(p_type)=>
		if !resultVersion
			return null

		version = resultVersion.replace('SL_PROJECT_VERSION:', '')
		date = resultDate.replace('SL_PROJECT_DATE:', '')
		values = version.split('.')
		release = parseInt(values[0])
		build = parseInt(values[1])
		bugfix = parseInt(values[2])
		
		switch p_type
			when 'release'
				release += 1
				date = Date.now()
			when 'build'
				build += 1
				date = Date.now()
			when 'bugfix'
				bugfix += 1
				date = Date.now()

		resultDate = 'SL_PROJECT_DATE:' + date
		resultVersion = 'SL_PROJECT_VERSION:' + release + '.' + build + '.' + bugfix
		@notify('Current project version: '+release + '.' + build + '.' + bugfix, 'yellow')
		return [resultVersion, resultDate]

	hasFile:()->
		try
			result = fs.statSync(path)
			if result? && result.isFile()
				return true
		catch err
			# @notify(err, 'magenta')
		return false

