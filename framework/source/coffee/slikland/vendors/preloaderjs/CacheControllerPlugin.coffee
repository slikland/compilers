#import slikland.utils.StringUtils

do ->
	'use strict'

	CacheControllerPlugin = ->

	s = CacheControllerPlugin

	s.getPreloadHandlers = () ->
		return {callback: s.preloadHandler, types: ["binary", "image", "javascript", "json", "jsonp", "sound", "video", "svg", "text", "xml"]}

	s.preloadHandler = (p_loadItem, p_queue) ->
		views = app?.config?.views
		view = views?[p_queue.id]
		parentView = views?[view?.parentView]
		
		cv = false
		ts = new Date().getTime()

		if p_loadItem.cache?
			#  set by item
			if p_loadItem.cache == false
				cv = true
		else if view?.cache?
			#  set by view
			if view?.cache == false
				cv = true
		else if parentView?.cache?
			#  When don't sets the cache value in config file the view and all your assets inherits of his parent
			#  set by parent
			if parentView?.cache == false
				cv = true

		cache = if cv then "?v="+app.getInfo().version+"&noCache="+ts else "?v="+app.getInfo().version
		p_loadItem.src += cache 
		return true

	createjs.CacheControllerPlugin = CacheControllerPlugin
	return
