#import slikland.core.debug.Debug
#import slikland.utils.Prototypes
#import slikland.core.App

#import slikland.utils.ArrayUtils
#import slikland.utils.ObjectUtils
#import slikland.utils.StringUtils
#import slikland.utils.JSONUtils
#import slikland.utils.Detections

#import slikland.loader.AssetLoader
#import slikland.core.loader.ConditionsValidation
#import slikland.navigation.display.BaseView

###*
Base class to setup the navigation and start loading of dependencies.

@class NavigationLoader
@extends EventDispatcher
###
class NavigationLoader extends EventDispatcher

	head = null
	wrapper = null
	
	_mainView = null
	_preloaderView = null

	app.root = null
	app.loader = null
	app.config = {}
	app.container = {}
	app.navigation = {}
	app.conditions = null
	app.detections = null

	###*
	@class NavigationLoader
	@constructor
	@param {BaseView} p_preloaderView The view of the first loading, it's called by the method {{#crossLink "NavigationLoader/createPreloaderView:method"}}{{/crossLink}} and attached on container when the preloader assets is completely loaded.
	@param {String} [p_configPath = "data/config.json"] Path of the navigation configuration file.
	@param {HTMLElement} [p_wrapper = null] Custom container to attach the navigation.
	###
	constructor:(p_preloaderView, p_configPath = "data/config.json", p_wrapper=null)->
		wrapper = if !(p_wrapper)? then document.body else p_wrapper

		if !(p_configPath)? then throw new Error('The param p_configPath is null')

		if !(p_preloaderView instanceof BaseView)
			throw new Error('The param p_preloaderView is null or the instance of param p_preloaderView is not either BaseView class')
		else
			_preloaderView = p_preloaderView 
		
		head = document.querySelector("head") || document.getElementsByTagName("head")[0]
		app.root = document.querySelector("base")?.href || document.getElementsByTagName("base")[0]?.href
		app.loader = @loader = AssetLoader.getInstance()
		app.detections = Detections.getInstance()

		@loaded = false
		@queue = @loader.getGroup('config')
		@queue.on(AssetLoader.COMPLETE_FILE, @_prepareConfigFile)
		@queue.loadFile 
			id: 'config',
			src: if app.root? then app.root+p_configPath else p_configPath
		false
	
	###*
	@method _prepareConfigFile
	@param {Event} evt
	@private
	###
	_prepareConfigFile:(evt)=>
		@queue.off(AssetLoader.COMPLETE_FILE, @_prepareConfigFile)
		
		@_parseConfigFile(evt.result)
		
		queue = @loader.getGroup('preloadContents')
		queue.on(AssetLoader.COMPLETE_ALL, @_createLoadQueue)
		
		if app.config.preloadContents.length > 0
			queue.loadManifest(app.config.preloadContents)
		else
			@_createLoadQueue(null)
		false 

	###*
	@method _createLoadQueue
	@param {Event} evt
	@private
	###
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
		firstIndexes = @loaderSteps.length

		for k, v of queues
			switch k
				when 'preloader', 'core', 'main'
					@loaderSteps.splice(firstIndexes, 0, {id:k, data:v, ratio:(1/total)})
					firstIndexes++
				else
					@loaderSteps.push {id:k, data:v, ratio:(1/total)}

		@queue = @_createLoader(@currentStep.id)
		if check>0 then @queue.load()
		false
	
	###*
	@method _parseContentFiles
	@param {Array} p_views
	@param {Object} p_data
	@private
	###
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
							if typeof(obj.src) != 'object' && obj.src != '{}'
								obj.src += cache
								filtered.push obj
							else
								cloneSrc = ObjectUtils.clone(obj.src)
								for i in [0...cloneSrc.length]
									if cloneSrc[i].condition?
										if app.conditions.test(cloneSrc[i].condition)
											if cloneSrc[i].file?
												obj.src = cloneSrc[i].file+cache
												filtered.push obj
											break
									else
										if cloneSrc[i].file?
											obj.src = cloneSrc[i].file+cache
											filtered.push obj
											break

							
					app.config.required[node] = ArrayUtils.merge(app.config.required[node], filtered)

		for k, v of p_views
			if p_data[v.content]
				v.content = p_data[v.content]
				v.content = @_normalizePaths(v.content, app.config.paths)
				if typeof v.content is 'object'
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
							if typeof(obj.src) != 'object' && obj.src != '{}'
								obj.src += cache
								filtered.push obj
							else
								cloneSrc = ObjectUtils.clone(obj.src)
								for i in [0...cloneSrc.length]
									if cloneSrc[i].condition?
										if app.conditions.test(cloneSrc[i].condition)
											if cloneSrc[i].file?
												obj.src = cloneSrc[i].file+cache
												filtered.push obj
											break
									else
										if cloneSrc[i].file?
											obj.src = cloneSrc[i].file+cache
											filtered.push obj
											break

					if !app.config.required[v.id]
						app.config.required[v.id] = []
						app.config.required[v.id] = filtered
					else
						app.config.required[node] = ArrayUtils.merge(app.config.required[node], filtered)

			if v.subviews then @_parseContentFiles(v.subviews, p_data)
		false

	###*
	@method _parseConfigFile
	@param {Object} p_data
	@private
	@return {Object}
	###
	_parseConfigFile:(p_data)->
		p_data.paths = @_normalizeConfigPaths(p_data.paths)
		p_data = @_normalizePaths(p_data, p_data.paths)

		if !p_data.preloadContents then p_data.preloadContents = []
		ts = new Date().getTime()
		temp = []
		
		p_data.conditions ?= {}
		app.conditions ||= ConditionsValidation.getInstance(p_data.conditions)

		for k, v of p_data.views
			v.class = StringUtils.toCamelCase(v.class)
			temp[v.id] = v
			if v.loadContent && v.content
				cache = if v.cache isnt undefined && v.cache is false then "?noCache="+ts else ""
				if typeof(v.content) != 'object' && v.content != '{}'
					p_data.preloadContents.push {'id':v.content, 'src':v.content+cache}
				else
					for i in [0...v.content.length]
						if v.content[i].condition?
							if app.conditions.test(v.content[i].condition)
								if v.content[i].file?
									p_data.preloadContents.push {'id':v.content[i].file, 'src':v.content[i].file+cache}
								break
						else
							if v.content[i].file?
								p_data.preloadContents.push {'id':v.content[i].file, 'src':v.content[i].file+cache}
								break

		for k, v of p_data.views
			if v.parentView == v.id then throw new Error('The parent view cannot be herself')

			if temp[v.parentView]? && v.parentView != v.id
				if !temp[v.parentView].subviews then temp[v.parentView].subviews = {}
				#
				#  When don't set the loadContent to true or cache to false in config file the view inherits of this parent
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
					else
						for i in [0...v.content.length]
							if v.content[i].condition?
								if app.conditions.test(v.content[i].condition)
									if v.content[i].file?
										p_data.preloadContents.push {'id':v.content[i].file, 'src':v.content[i].file+cache}
									break
							else
								if v.content[i].file?
									p_data.preloadContents.push {'id':v.content[i].file, 'src':v.content[i].file+cache}
									break
		for id of p_data.required
			for k, v of p_data.required[id]
				if v.content
					cache = if v.cache isnt undefined && v.cache is false then "?noCache="+ts else ""
					if typeof(v.content) != 'object' && v.content != '{}'
						p_data.preloadContents.push {'id':v.content, 'src':v.content+cache}
					else
						for i in [0...v.content.length]
							if v.content[i].condition?
								if app.conditions.test(v.content[i].condition)
									if v.content[i].file?
										p_data.preloadContents.push {'id':v.content[i].file, 'src':v.content[i].file+cache}
									break
							else
								if v.content[i].file?
									p_data.preloadContents.push {'id':v.content[i].file, 'src':v.content[i].file+cache}
									break
		p_data.views = temp
		app.config = p_data
		return p_data

	###*
	@method _createLoader
	@param {String} p_id
	@private
	@return {createjs.LoadQueue}
	###
	_createLoader:(p_id)->
		# console.log "id:", p_id
		queue = @loader.getGroup(p_id)
		queue.on(AssetLoader.COMPLETE_FILE, @_loadFileComplete)
		queue.on(AssetLoader.PROGRESS_ALL, @_loadProgress)
		queue.on(AssetLoader.COMPLETE_ALL, @_loadComplete)
		return queue

	###*
	@method _removeLoader
	@param {Object} p_queue
	@private
	@return {createjs.LoadQueue}
	###
	_removeLoader:(p_queue)->
		p_queue.removeAllEventListeners(AssetLoader.COMPLETE_FILE)
		p_queue.removeAllEventListeners(AssetLoader.PROGRESS_ALL)
		p_queue.removeAllEventListeners(AssetLoader.COMPLETE_ALL)
		p_queue.destroy()
		return p_queue

	###*
	@method _addFiles
	@param {Object} p_files
	@private
	###
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
	
	###*
	@method _normalizeConfigPaths
	@param {Object} p_paths
	@private
	###
	_normalizeConfigPaths:(p_paths)->
		p_pathsStr = JSON.stringify(p_paths)
		while (o = /\{([^\"\{\}]+)\}/.exec(p_pathsStr))
			val = p_paths[o[1]]
			if !val
				val = ''
			p_pathsStr = p_pathsStr.replace(new RegExp('\{'+o[1]+'\}', 'ig'), val)
			p_paths = JSON.parse(p_pathsStr)
		return p_paths

	###*
	@method _normalizePaths
	@param {Object} p_data
	@param {Object} p_paths
	@return {Object}
	@private
	###
	_normalizePaths:(p_data, p_paths)->
		for k, v of p_paths
			p_data = JSON.stringify(p_data)
			p_data = p_data.replace(new RegExp('\{'+k+'\}', 'ig'), v)
			p_data = JSON.parse(p_data)
		return p_data

	###*
	@method _loadFileComplete
	@param {Event} evt
	@private
	###
	_loadFileComplete:(evt)=>
		switch evt.item.ext
			when 'json'
				data = evt.result
				data = JSONUtils.removeComments(evt.result)
				data = @_normalizePaths(data, app.config.paths)
				if typeof(data) isnt 'string' then data = JSON.stringify(data)

			when 'js'
				data = evt.result
				data = data.replace(/^\/\/.*?(\n|$)/igm, '')
				if @currentStep.id == 'main'
					result = eval(data)
					_mainView = result
					_mainView.id = 'main'
				else
					eval('(function (){' + data + '}).call(self)')
					
			when 'css'
				data = evt.result
				style = document.createElement('style')
				style.id = evt.item.id
				style.type = "text/css"
				head.appendChild(style)
				si = head.querySelectorAll('style').length
				
				try
					style.appendChild(document.createTextNode(data))
				catch e
					if document.all
						document.styleSheets[si].cssText = data
		false

	###*
	@method _loadProgress
	@param {Event} evt
	@private
	###
	_loadProgress:(evt)=>
		_preloaderView?.progress = ((evt.loaded / evt.total) * @currentStep.ratio + @loaderRatio)
		false

	###*
	@method _loadComplete
	@param {Event} evt
	@private
	###
	_loadComplete:(evt)=>
		@_removeLoader(@queue)

		step = @loaderSteps[@loaderStep]
		if step
			switch step.id
				when 'core'
					@coreAssetsLoaded()
					break
				when 'main'
					view = _mainView
					@mainAssetsLoaded()
					break
				when 'preloader'
					view = _preloaderView
					@preloaderAssetsLoaded()
					@createPreloaderView()
					break
			for k, v of app.config.required[step.id]
				if v?.content?
					view.content = v.content
					break

		@loaderRatio += step.ratio
		@loaderStep++
		
		if @loaderStep >= @loaderSteps.length
			@loaded = true
			return @hidePreloderView()

		@currentStep = @loaderSteps[@loaderStep]
		@queue = @_createLoader(@currentStep.id)
		@_addFiles(@currentStep.data)

		if @queue._loadQueue.length + @queue._currentLoads.length is 0 then @_loadComplete()
		false

	###*
	@method createPreloaderView
	@param {Event} [evt=null]
	@protected
	###
	createPreloaderView:(evt=null)=>
		wrapper.appendChild(_preloaderView.element)
		_preloaderView.on(BaseView.CREATE_COMPLETE, @showPreloaderView)
		_preloaderView.createStart()
		false
		
	###*
	@method showPreloaderView
	@param {Event} [evt=null]
	@protected
	###
	showPreloaderView:(evt=null)=>
		_preloaderView.off(BaseView.CREATE_COMPLETE, @showPreloaderView)
		_preloaderView.showStart()
		false

	###*
	@method hidePreloderView
	@param {Event} [evt=null]
	@protected
	###
	hidePreloderView:(evt=null)=>
		_preloaderView.on(BaseView.HIDE_COMPLETE, @destroyPreloderView)
		_preloaderView.progress = 1
		_preloaderView.hideStart()
		false

	###*
	@method destroyPreloderView
	@param {Event} [evt=null]
	@protected
	###
	destroyPreloderView:(evt=null)=>
		hiddenFonts = document.getElementById('hiddenFonts')
		hiddenFonts?.parentNode?.removeChild(hiddenFonts)

		_preloaderView.off(BaseView.HIDE_COMPLETE, @destroyPreloderView)
		_preloaderView.on(BaseView.DESTROY_COMPLETE, @_createMainView)
		_preloaderView.destroy()

		@_removeLoader(@queue)
		false

	###*
	@method _createMainView
	@private
	###
	_createMainView:()=>
		_preloaderView.off(BaseView.DESTROY_COMPLETE, @_createMainView)
		wrapper.removeChild(_preloaderView.element)
		_preloaderView = null

		if !(_mainView instanceof BaseView) then throw new Error('The instance of Main class is not either BaseView class')

		app.container = _mainView
		wrapper.appendChild(_mainView.element)

		_mainView.on(BaseView.CREATE_COMPLETE, @_showMainView)
		if app.config.navigation?.startBefore || app.config.navigation?.startBefore is undefined
			_mainView.setupNavigation(app.config)
			_mainView.createStart()
		else
			_mainView.createStart()
			_mainView.setupNavigation(app.config)

		false
	
	###*
	@method _showMainView
	@param {Event} [evt=null]
	@private
	###
	_showMainView:(evt=null)=>
		_mainView.off(BaseView.CREATE_COMPLETE, @_showMainView)
		_mainView.showStart()
		false

	###*
	Called only when the core assets is completely loaded.
	@method coreAssetsLoaded
	@param {Event} [evt=null]
	###
	coreAssetsLoaded:(evt=null)=>
		false

	###*
	Called only when the preloader assets is completely loaded.
	@method preloaderAssetsLoaded
	@param {Event} [evt=null]
	###
	preloaderAssetsLoaded:(evt=null)=>
		false

	###*
	Called only when the main assets is completely loaded.
	@method mainAssetsLoaded
	@param {Event} [evt=null]
	###
	mainAssetsLoaded:(evt=null)=>
		false
