#import slikland.utils.ObjectUtils
#import slikland.utils.Detections

class ConditionsValidation

	_list = null
	_detections = null

	@getInstance:(p_data)=>
		@_instance ?= new @(p_data)

	constructor:(p_data)->
		_detections = app.detections
		_list = ObjectUtils.clone(p_data)

	add:(p_obj)->
		if ObjectUtils.hasSameKey(p_obj, _list) || ObjectUtils.isEqual(p_obj, _list)
			throw new Error('The object ' + JSON.stringify(p_obj) + ' already exists in validations list.')
		for k, v of p_obj
			_list[k] = v
		return true

	@get list:()->
		return _list

	get:(p_keyID)->
		return if @has(p_keyID) then _list[p_keyID] else throw new Error("The key " + p_keyID + " does not exists in validations list.")

	has:(p_keyID)->
		return if _list[p_keyID] then true else false
		
	remove:(p_keyID)->
		if _list[p_keyID]
			delete _list[p_keyID]
			return true
		else
			throw new Error("The key " + p_keyID + " does not exists in validations list.")
		return false

	test:(p_args)->
		parsed = p_args.replace(new RegExp(/\w+/g), "validate('$&')")
		validate = @validate
		return eval('(function(){return (' + parsed + ');})();')

	validate:(p_keyID)=>
		result = []
		for k, v of @get(p_keyID)
			switch k
				when "size"
					matchSize = true
					for key, value of v
						switch key
							when "max-width"
								if window.innerWidth > value
									matchSize = false
									break
							when "min-width"
								if window.innerWidth < value
									matchSize = false
									break
							when "max-height"
								if window.innerHeight > value
									matchSize = false
									break
							when "min-height"
								if window.innerHeight < value
									matchSize = false
									break
					result.push(matchSize)
				when "browser"
					for key, value of v
						switch key
							when "ua"
								result.push(new RegExp(value).test(_detections.ua))
							when "version"
								a = value.match(/\d+/g)
								total = a.length
								if total > _detections.versionArr.length
									total = _detections.versionArr.length
								for i in [0..total]
									if a[i] == undefined then continue
									match = 0
									if  a[i] > _detections.versionArr[i]
										match = 1
										break
									else if a[i] < _detections.versionArr[i]
										match = -1
										break
								r = value.match(/[<>=]+/g)?[0] || '=='
								if r.lengh == 0
									r = '=='
								result.push(eval('0' + r + 'match'))
							else
								try
									if _detections[key]?
										result.push(value == _detections[key])
								catch err
									
				when "domain"
					result.push(v.toLowerCase() == window.location.hostname.toLowerCase())
				when "platform"
					result.push(v.toLowerCase() == _detections.platform.toLowerCase())
		return if result.indexOf(false) == -1 then true else false

	customTest:(p_callback, p_args...)->
		return p_callback.call(undefined, p_args)
