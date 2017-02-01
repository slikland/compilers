#import slikland.navigation.core.data.ParseData

#import slikland.utils.StringUtils

class ParseConfig extends ParseData
	
	_views = null
	_contents = null
	_required = null
	
	constructor:(p_data)->
		super(p_data)
		_contents ?= []
		_views ?= @_setViews()
		_required ?= @_setRequired()

	@get views:()->
		return _views
		
	@get contents:()->
		return _contents
		
	@get required:()->
		return _required
		
	###*
	@method _setViews
	@return {Object}
	@private
	###
	_setViews:()->
		results = []
		for k, v of @data.views
			v.class = StringUtils.toCamelCase(v.class)
			if v.content
				v.content = @getPath(v.content)
				_contents.push @_contentGroup(v)
			results[v.id] = v

		for k, v of @data.views
			if v.parentView == v.id then throw new Error('The parent view cannot be herself')
			if results[v.parentView]? && v.parentView != v.id
				if !results[v.parentView].subviews then results[v.parentView].subviews = {}
				if v.loadContent == undefined
					v.loadContent = if results[v.parentView].loadContent? then results[v.parentView].loadContent else true
				else
					v.loadContent = v.loadContent
				results[v.parentView].subviews[v.id] = v
		@data.views = results
		return results
	
	###*
	@method _setRequired
	@return {Object}
	@private
	###
	_setRequired:()->
		results = []
		for id of @data.required
			group = []
			for k, v of @data.required[id]
				v.group = id
				if v.src then v.src = @getPath(v.src)
				if v.content
					v.content = @getPath(v.content)
					_contents.push @_contentGroup(v)
				v.id = if v.id then v.id else v.src || v.content
				group[v.id] = v
			results[id] = group
		@data.required = results
		return results

	###*
	@method _contentGroup
	@param {Object} p_data
	@return {Array}
	@private
	###
	_contentGroup:(p_data)->
		result = {}
		if p_data.id then result.id = p_data.id
		if p_data.group then result.group = p_data.group
		result.src = @getPath(p_data.content)
		result.cache = if p_data.cache || p_data.cache == undefined then true else false
		result.loadContent = if p_data.loadContent || p_data.loadContent == undefined then true else false
		return result
