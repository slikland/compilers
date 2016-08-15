class API extends EventDispatcher

	@COMPLETE: 'apiComplete'
	@ERROR: 'apiError'
	@PROGRESS: 'apiProgress'
	@ROOT_PATH: ''
	
	@_request:()->
		if window.XMLHttpRequest then return new XMLHttpRequest()
		else if window.ActiveXObject then return new ActiveXObject("MSXML2.XMLHTTP.3.0")
	
	@call:(url, data = null, onComplete = null, onError = null, type = 'json', method = 'POST')->
		if arguments.length < 1
			return
		if !url
			return
		if data?['onComplete']? && arguments.length == 2
			onComplete = data?['onComplete']
			onError = data?['onError']
			type = data?['type']
			data = data?['params']
		
		api = new API(API.ROOT_PATH + url, data, method, type)
		
		if onComplete
			api.on(@COMPLETE, onComplete)
		if onError
			api.on(@ERROR, onError)

		api.load()
		return api

	constructor:(@url, @params = null, @method = 'POST', @type = 'json')->
		super()
		@reuse = false
		@stackTrigger('test')

	load:(data = null)->
		if data
			@params = data
		url = @url.split('.').join('/')
		if FormData? && @params instanceof FormData
			@method = 'POST'
			formData = @params
		else
			if FormData? && @method == 'POST'
				formData = new FormData();
				formData.append n, v for n, v of @params
			else
				formData = []
				formData.push(n + '=' + v) for n, v of @params
				formData = formData.join('&') if !FormData?

		@req = API._request()
		@req.onreadystatechange = @_loaded
		@req.addEventListener('progress', @_progress)
		@req.open(@method, @url, true)
		# @req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
		# @req.setRequestHeader('Content-type', 'multipart/form-data')
		@req.send(formData)
	_progress:(e)=>
		@trigger(@constructor.PROGRESS, e)
		
	cancel:->
		if @req
			@req.onreadystatechange = null
			@req.abort()
		if !@reuse
			@off()

	_loaded:(e)=>
		if e.currentTarget.readyState == 4
			if e.currentTarget.status == 200
				data = e.currentTarget.responseText
				try
					if typeof(@type) == 'function'
						data = @type(data)
					else if @type == 'json'
						data = JSON.parse(e.currentTarget.responseText)
					@trigger(@constructor.COMPLETE, data)
				catch err
					@trigger(@constructor.ERROR, err)
			else
				@trigger(@constructor.ERROR, null, e.currentTarget.status)
			if !@reuse
				@off()