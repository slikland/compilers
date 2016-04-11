#import slikland.debug.Debug
#import slikland.utils.Prototypes
#import slikland.core.App

#import slikland.utils.ObjectUtils
#import slikland.utils.StringUtils
#import slikland.utils.JSONUtils

#import slikland.loader.AssetLoader
#import slikland.loader.LoadValidations
#import slikland.core.navigation.BaseView

class NavigationLoader extends EventDispatcher

	head = null
	wrapper = null

	app.root = null
	app.loader = null
	app.config = {}
	app.container = {}
	app.navigation = {}

	constructor:(p_preloaderView, p_configPath = "data/config.json", p_wrapper=null)->
		wrapper = if !(p_wrapper)? then document.body else p_wrapper

		if !(p_configPath)? then throw new Error('The param p_configPath is null')

		if !(p_preloaderView instanceof BaseView)
			throw new Error('The param p_preloaderView is null or the instance of param p_preloaderView is not either BaseView class')
		else
			@_preloaderView = p_preloaderView 
		
		head = document.querySelector("head") || document.getElementsByTagName("head")[0]
		app.root = document.querySelector("base")?.href || document.getElementsByTagName("base")[0]?.href
		app.loader = @loader = AssetLoader.getInstance()

		@queue = @loader.getGroup('config')
		@queue.on(AssetLoader.COMPLETE_FILE, @_prepareConfigFile)
		@queue.loadFile 
				id: 'config',
				src: if app.root? then app.root+p_configPath else p_configPath
		false

	_prepareConfigFile:(evt)=>
		@queue.off(AssetLoader.COMPLETE_FILE, @_prepareConfigFile)
		
		@_parseConfigFile(evt.result)

		routeUtils = RouteUtils.getInstance()
		routeUtils.setup(app.config.views)
		pathData = routeUtils.parsePath(location.href.replace(app.root, ''))
		@_initialRouteParams = routeUtils.checkRoute(pathData.path)
		@_initialView = routeUtils.getViewIdByRoute(@_initialRouteParams[0]?[0]?.route)
		
		@_configQueue = @loader.getGroup('preloadContents')
		@_configQueue.on(AssetLoader.COMPLETE_ALL, @_createLoadQueue)
		@_configQueue.on(AssetLoader.COMPLETE_FILE, @_checkInternalContent)

		if app.config.preloadContents.length > 0
			@_configQueue.loadManifest(app.config.preloadContents)
		else
			@_createLoadQueue(null)
		false 

	_checkInternalContent:(evt)=>
		data = evt.result

		#fix scope
		if evt.item.scope
			evt.item.scope.tag = data

		#check internal content
		if evt.item.ext == 'json'
			viewId = evt.item.parentId || evt.item.id
			view = null
			filtered = JSONUtils.filterObject(data, 'service', null, null, true)

			for file in filtered
				view ?= @_getViewByContentId(viewId)
				normFile = @_normalizePaths(file, app.config.paths)
				ableToLoad = true

				#validate load
				if normFile.loadWhen
					ableToLoad = LoadValidations.getInstance().validate(normFile.loadWhen, [view, normFile])

				#insert service on queue
				if ableToLoad
					if normFile.internal
						#check if current page is same of service
						if @_initialView == view.id
							#pause loader when loading service
							@_configQueue.setPaused(true)
							#load service
							DataController.getInstance().callAPI normFile.service, @_initialRouteParams[1], (e, result)=>
									#continue loop
									@_checkInternalContent
										result: result
										item:
											id: normFile.id
											ext: 'json'
											scope: file
											parentId: viewId
									#resume loading
									@_configQueue.setPaused(false)
								,@_serviceFailed
					else
						#load via preload js
						@_configQueue.loadFile
							id: normFile.id
							src: normFile.service
							scope: file
							parentId: viewId

	_serviceFailed:()=>
		@_configQueue.setPaused(false)

	_getViewByContentId:(contentId)->
		for k,v of app.config.views
			if v.content == contentId
				return v
				break

	_createLoadQueue:(evt)=>
		evt?.currentTarget?.off(AssetLoader.COMPLETE_ALL, @_createLoadQueue)
		
		@loaderSteps = [
			{ratio: 0, id: 'config'}
		]

		@loaderStep = 0
		@loaderRatio = 0
		@currentStep = @loaderSteps[0]
		
		check = ObjectUtils.count(evt?.currentTarget?._loadedResults)

		if check > 0 then @_parseContentFiles(app.config.views, evt.currentTarget._loadedResults)

		queues = app.config.required
		total = ObjectUtils.count(queues)
		firstIndex = @loaderSteps.length

		for k, v of queues
			switch k
				when 'preloader' then @loaderSteps[firstIndex] = {id:k, data:v, ratio:(1/total)}
				when 'core' then @loaderSteps[firstIndex + 1] = {id:k, data:v, ratio:(1/total)}
				when 'main' then @loaderSteps[firstIndex + 2] = {id:k, data:v, ratio:(1/total)}

		for k, v of queues
			continue if k == 'preloader' || k == 'core' || k == 'main'
			@loaderSteps.push {id:k, data:v, ratio:(1/total)}
			
		@queue = @_createLoader(@currentStep.id)
		if check>0 then @queue.load()
		false

	_parseContentFiles:(p_views, p_data)=>
		ts = new Date().getTime()
		for node of app.config.required
			for k, v of app.config.required[node]
				if typeof v?.content is 'string'
					v.content = p_data[v.content]
					v.content = @_normalizePaths(v.content, app.config.paths)
					results = JSONUtils.filterObject(v.content, 'src', null, null, true)
					filtered = []
					for index, obj of results
						if obj.loadWithView is true || obj.loadWithView is undefined

							if !obj.id? || obj.id is undefined then obj.id = obj.src
							
							if obj.cache isnt undefined
								cache = if obj.cache is false then cache = "?noCache="+ts else ""
							else if v.cache isnt undefined && v.cache is false
								cache = "?noCache="+ts
							else
								cache = ""

							#image validation
							if obj.loadWhen
								if !LoadValidations.getInstance().validate(obj.loadWhen, [v, obj])
									continue

							#test multiple formats
							if typeof(obj.src) == 'object'
								for item,i in obj.src
									if item.when == undefined
										obj.originalSrc = obj.src
										obj.originalSrc[i].isDefault = true
										obj.src = item.file
										break

									if LoadValidations.getInstance().validate(item.when, [v, obj])
										obj.originalSrc = obj.src
										obj.originalSrc[i].isDefault = true
										obj.src = item.file
										break

							obj.src += cache
							obj.src = obj.src.replace(app.root, '')
							filtered.push obj

					app.config.required[node] = ArrayUtils.merge(app.config.required[node], filtered)

		for k, v of p_views
			if p_data[v.content]
				v.content = p_data[v.content]

			if typeof v.content is 'object'
				v.content = @_normalizePaths(v.content, app.config.paths)
				results = JSONUtils.filterObject(v.content, 'src', null, null, true)
				filtered = []
				for index, obj of results
					if obj.loadWithView is true || obj.loadWithView is undefined
						if !obj.id? || obj.id is undefined then obj.id = obj.src
						
						if obj.cache isnt undefined
							cache = if obj.cache is false then cache = "?noCache="+ts else ""
						else if v.cache isnt undefined && v.cache is false
							cache = "?noCache="+ts
						else
							cache = ""

						#image validation
						if obj.loadWhen
							if !LoadValidations.getInstance().validate(obj.loadWhen, [v, obj])
								continue
								
						#test multiple formats
						if typeof(obj.src) == 'object'
							for item,i in obj.src
								if item.when == undefined
									obj.originalSrc = obj.src
									obj.originalSrc[i].isDefault = true
									obj.src = item.file
									break

								if LoadValidations.getInstance().validate(item.when, [v, obj])
									obj.originalSrc = obj.src
									obj.originalSrc[i].isDefault = true
									obj.src = item.file
									break

						obj.src += cache
						obj.src = obj.src.replace(app.root, '')
						filtered.push obj

				if !app.config.required[v.id]
					app.config.required[v.id] = []
					app.config.required[v.id] = filtered
				else
					app.config.required[node] = ArrayUtils.merge(app.config.required[node], filtered)

		false

	_parseConfigFile:(p_data)->
		p_data = @_normalizePaths(p_data, p_data.paths)

		if !p_data.preloadContents then p_data.preloadContents = []
		ts = new Date().getTime()
		temp = []

		for k, v of p_data.views
			v.class = StringUtils.toCamelCase(v.class)
			temp[v.id] = v
			if v.loadContent && v.content
				cache = if v.cache isnt undefined && v.cache is false then "?noCache="+ts else ""
				if typeof(v.content) != 'object' && v.content != '{}'
					p_data.preloadContents.push {'id':v.content, 'src':v.content+cache}

		for k, v of p_data.views
			if v.parentView == v.id then throw new Error('The parent view cannot be herself')

			if temp[v.parentView]? && v.parentView != v.id
				if !temp[v.parentView].subviews then temp[v.parentView].subviews = {}
				#
				#  When don't set the loadContent to true or chache to false in config file the view inherits of this parent
				#  console.log v.id, v.loadContent, v.cache
				# 
				v.loadContent = if !v.loadContent? then temp[v.parentView].loadContent else v.loadContent
				temp[v.parentView].subviews[v.id] = v
				if v.loadContent && v.content
					if v.cache isnt undefined
						cache = if v.cache is false then cache = "?noCache="+ts else ""
					else if temp[v.parentView].cache isnt undefined && temp[v.parentView].cache is false
						cache = "?noCache="+ts
					else
						cache = ""

					if typeof(v.content) != 'object' && v.content != '{}'
						p_data.preloadContents.push {'id':v.content, 'src':v.content+cache}

		for id of p_data.required
			for k, v of p_data.required[id]
				if v.content
					cache = if v.cache isnt undefined && v.cache is false then "?noCache="+ts else ""
					p_data.preloadContents.push {'id':v.content, 'src':v.content+cache}

		p_data.views = temp
		app.config = p_data
		return p_data

	_createLoader:(p_id)->
		# console.log "id:", p_id
		queue = @loader.getGroup(p_id)
		queue.on(AssetLoader.COMPLETE_FILE, @_loadFileComplete)
		queue.on(AssetLoader.PROGRESS_ALL, @_loadProgress)
		queue.on(AssetLoader.COMPLETE_ALL, @_loadComplete)
		return queue

	_removeLoader:(p_queue)->
		p_queue.removeAllEventListeners(AssetLoader.COMPLETE_FILE)
		p_queue.removeAllEventListeners(AssetLoader.PROGRESS_ALL)
		p_queue.removeAllEventListeners(AssetLoader.COMPLETE_ALL)
		p_queue.destroy()
		return p_queue

	_addFiles:(p_files)->
		ts = new Date().getTime()
		jsRE = /.*\.(js|css|svg)$/g
		for f in p_files
			if f?.src?
				if !f.id? || f.id is undefined then f.id = f.src
				if f.src.indexOf('.json') != -1
					f.src = f.src
				jsRE.lastIndex = 0
				if typeof f is 'string'
					if jsRE.test(f) then f = {src: f, type: 'text'}
				else if f.src && jsRE.test(f.src)
					f['type'] = 'text'
				cache = if f.cache isnt undefined && f.cache is false && f.src.indexOf('?noCache=') is -1 then "?noCache="+ts else ""
				f.src += cache
				@queue.loadFile(f, false)
		if p_files.length > 0
			@queue.load()
		false

	_normalizePaths:(p_data, p_paths)->
		for k, v of p_paths
			p_data = JSON.stringify(p_data)
			p_data = p_data.replace(new RegExp('\{'+k+'\}', 'ig'), v)
			p_data = JSON.parse(p_data)
		return p_data

	_loadFileComplete:(p_event)=>
		switch p_event.item.ext
			when 'json'
				data = p_event.result
				data = JSONUtils.removeComments(p_event.result)
				data = @_normalizePaths(data, app.config.paths)
				if typeof(data) isnt 'string' then data = JSON.stringify(data)

			when 'js'
				data = p_event.result
				data = data.replace(/^\/\/.*?(\n|$)/igm, '')
				if @currentStep.id == 'main'
					result = eval(data)
					@_mainView = result
					@_mainView.id = 'main'
				else
					eval('(function (){' + data + '}).call(self)')
					
			when 'css'
				data = p_event.result
				style = document.createElement('style')
				style.id = p_event.item.id
				style.type = "text/css"
				head.appendChild(style)
				si = head.querySelectorAll('style').length
				
				try
					style.appendChild(document.createTextNode(data))
				catch e
					if document.all
						document.styleSheets[si].cssText = data
		false

	_loadProgress:(evt)=>
		@_preloaderView?.progress = ((evt.loaded / evt.total) * @currentStep.ratio + @loaderRatio)
		false

	_loadComplete:(p_event)=>
		@_removeLoader(@queue)

		step = @loaderSteps[@loaderStep]
		if step
			switch step.id
				when 'core'
					@coreAssetsLoaded()
					break
				when 'main'
					for k, v of app.config.required.main
						if v?.content?
							@_mainView.content = v.content
							break
					@mainAssetsLoaded()
					break
				when 'preloader'
					@preloaderAssetsLoaded()
					@_createPreloaderView()
					break

		@loaderRatio += step.ratio
		@loaderStep++
		
		if @loaderStep >= @loaderSteps.length then return @_hidePreloderView()

		@currentStep = @loaderSteps[@loaderStep]
		@queue = @_createLoader(@currentStep.id)
		@_addFiles(@currentStep.data)

		if @queue._loadQueue.length + @queue._currentLoads.length is 0 then @_loadComplete()
		false

	_createPreloaderView:(evt=null)=>
		wrapper.appendChild(@_preloaderView.element)
		@_preloaderView.on(BaseView.CREATE_COMPLETE, @_showPreloaderView)
		@_preloaderView.createStart()
		false
		
	_showPreloaderView:(evt=null)=>
		@_preloaderView.off(BaseView.CREATE_COMPLETE, @_showPreloaderView)
		@_preloaderView.showStart()
		false

	_hidePreloderView:(evt=null)->
		@_preloaderView.on(BaseView.HIDE_COMPLETE, @_destroyPreloderView)
		@_preloaderView.progress = 1
		@_preloaderView.hideStart()
		false

	_destroyPreloderView:(evt=null)=>
		hiddenFonts = document.getElementById('hiddenFonts')
		hiddenFonts?.parentNode?.removeChild(hiddenFonts)

		@_preloaderView.off(BaseView.HIDE_COMPLETE, @_destroyPreloderView)
		@_preloaderView.on(BaseView.DESTROY_COMPLETE, @_createMainView)
		@_preloaderView.destroy()

		@_removeLoader(@queue)
		false

	_createMainView:()=>
		@_preloaderView.off(BaseView.DESTROY_COMPLETE, @_createMainView)
		wrapper.removeChild(@_preloaderView.element)
		@_preloaderView = null
		delete @_preloaderView

		if !(@_mainView instanceof BaseView) then throw new Error('The instance of Main class is not either BaseView class')

		app.container = @_mainView
		wrapper.appendChild(@_mainView.element)

		@_mainView.on(BaseView.CREATE_COMPLETE, @_showMainView)
		if app.config.navigation?.startBefore || app.config.navigation?.startBefore is undefined
			@_mainView.setupNavigation(app.config)
			@_mainView.createStart()
		else
			@_mainView.createStart()
			@_mainView.setupNavigation(app.config)

		false
	
	_showMainView:(evt=null)=>
		@_mainView.off(BaseView.CREATE_COMPLETE, @_showMainView)
		false

	coreAssetsLoaded:(evt=null)=>
		false

	preloaderAssetsLoaded:(evt=null)=>
		false

	mainAssetsLoaded:(evt=null)=>
		false
