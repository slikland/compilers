#import slikland.tracking.GoogleAnalytics
#import slikland.tracking.GTM

class Tracking extends EventDispatcher
	@getInstance:()=>
		@_instance ?= new @(arguments...)

	_data:null
	_ga:null
	_hasGA:null
	_inited:null
	_lastPagePath:null

	# Initialize {Tracking}
	#
	# tag - {String} to tag from `_data`
	# data - {Object} to data
	init:(p_data)->
		@_data = p_data
		if @_inited then throw new Error('Tracking::track Tracking is already inited')
		@_inited = true

		@scope = @_data?['scope']
		@tags  = @_data?['tags']

		if @scope?['ga']?
			@_initGA()
		else if @scope?['gtm']
			@_initGTM()

		@_lastPagePath = null

	# Track
	#
	# tag - {String} to tag from `_data`
	# data - {Object} to data
	track:(p_tag, p_data=null)->
		if !@_inited then throw new Error('Tracking::track You must initialize Tracking class')

		if @tags[p_tag] then p_tag = @tags[p_tag]
		else throw new Error('Tracking::track Tag not triggered, it is not registered in `_data`')

		if @_hasGA && p_tag.ga
			@_trackGA(p_tag.ga, p_data)
		else if @_hasGTM and p_tag.gtm
			@_trackGTM(p_tag.gtm, p_data)

	##############
	## PRIVATES ##
	##############
	_initGTM:()->
		if !@_inited then throw new Error('Tracking::track You must initialize Tracking class')
		@_gtm = window.dataLayer = window.dataLayer || []
		if !@_gtm? then throw new Error('Tracking::track GTM not found')
		@_hasGTM = @_gtm?

	# Initialize Google Analytics
	_initGA:()->
		
		if !@_inited then throw new Error('Tracking::track You must initialize Tracking class')
		if !@scope['ga']?['id']? then throw new Error('Tracking::track The ID for Google Analytics is null')
		@_hasGA = true
		@_ga = new GoogleAnalytics(@scope['ga']?['id'])

	# GA Tracking
	#
	# tag - {String} to tag from `_data`
	# data - {Object} to data
	_trackGA:(p_tag, p_data)->
		vals = ['category', 'action', 'label', 'value']
		params = []

		for v, i in vals
			if !p_tag[v]? then continue
			v = p_tag[v]
			# console.log("TRACKING", v)
			if v.replace?
				v = v.replace(/\{(.*?)\}/g, (val, m) ->
					if p_data?[m]? then return p_data[m]
					else return ''
				)
			params[i] = v

		switch p_tag.type
			when 'pageview'
				if params[1] != @_lastPagePath
					@_ga.pageview(params[1])
				@_lastPagePath = params[1]
			when 'event'
				@_ga.event.apply(@, params)
			# else 
			# 	throw new Error('Tracking::_trackGA There is a tag with no type (event / pageview)')

	# GTM Tracking
	#
	# tag - {String} to tag from `_data`
	# data - {Object} to data
	_trackGTM:(p_tag, p_data)->
		vals = @scope['values'] || ['category', 'action', 'label', 'value']
		params = {}

		for v, i in vals
			if !p_tag[v]? then continue
			tagParam = p_tag[v]
			if tagParam.replace?
				while /\{.*?\}/.test(tagParam)
					tagParam = tagParam.replace(/\{([^\{\}]*?)\}/g, (val, m) ->
						if p_data?[m]? then return p_data[m]
						else return ''
					)
			params[v] = tagParam if tagParam? and !!tagParam.length

		switch p_tag.event
			when 'ga.pageview'
				@_gtm.push params
			when 'ga.event'
				@_gtm.push params
			else 
				throw new Error('Tracking::_trackGTM There is a tag with no type (ga.event / ga.pageview)')
