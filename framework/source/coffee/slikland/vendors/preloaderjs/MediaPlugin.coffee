#import slikland.vendors.preloaderjs.MediaRequest
#import slikland.vendors.preloaderjs.TagMediaLoader
#import slikland.vendors.preloaderjs.MediaLoader

do ->
	'use strict'

	MediaPlugin = ->

	s = MediaPlugin

	# return {Object} An object defining a callback, type handlers, and extension handlers (see description)
	s.getPreloadHandlers = () ->
		return {callback: MediaPlugin.handlers, types: ['sound', 'video'], extensions: ['mp3', 'mp4']}

	# return {Boolean|AbstractLoader} How PreloadJS should handle the load. See the main description for more info.
	s.handlers = (p_loadItem, queue) ->
		loader = new createjs.MediaLoader(p_loadItem, false)
		return loader

	createjs.MediaPlugin = MediaPlugin
	return
