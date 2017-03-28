#import slikland.event.EventDispatcher
#import slikland.navigation.core.data.PathsData

class LanguageData extends EventDispatcher
	@const SELECT_LANGUAGE : "select_language"

	_data = null
	_current = undefined
	_default = undefined

	@getInstance:()=>
		@_instance ?= new @()
	
	constructor:()->
		super

	hasLanguage:(p_value)->
		result = false
		if typeof(p_value) == 'string' && _data?.length > 0
			for i in [0..._data.length]
				if _data[i].iso == p_value
					result = true
					break
		return result

	@get data:(p_value)->
		return _data

	@set data:(p_value)->
		_data = p_value
		for k, v of p_value
			# ref: https://en.wikipedia.org/wiki/Language_localisation
			if !v.iso || v.iso && v.iso == "" then throw new Error('Please sets the "iso" object (ISO 639-1 standard) in languages object of config file.')
			if !v.path || v.path && v.path == "" then throw new Error('Please sets the "path" object in languages object of config file.')
			if v.default? then _default = v
		if !_default
			p_value[0].default = true
			_default = p_value[0]
		false

	@get current:()->
		return _current

	@set current:(p_value)->
		if typeof(p_value) == 'string' && _data?.length > 0
			for i in [0..._data.length]
				if _data[i].iso == p_value
					_current = _data[i]
					break
		else
			_current = p_value
		false
	@get default:()->
		return _default
