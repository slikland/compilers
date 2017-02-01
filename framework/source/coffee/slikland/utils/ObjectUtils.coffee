class ObjectUtils

	###*
	Return the length of a item.
	@method count
	@static
	@param {Object} p_item object to count.
	@return {Number}
	###	
	@count:(p_item)->
		result = 0
		try
			result = Object.keys(p_item).length
		catch err
			for key of p_item
				result++
		return result

	# Public: Return a {Array} of a {Object} item.
	#
	# source -  The {Object} object.
	#
	# Returns
	#   The resulting {Array}.
	@toArray:(p_source)->
		result = []
		result.push(p_source[k]) for k,v of p_source
		return result

	@merge:(a, b)->
		if typeof(a) == 'object' && typeof(b) == 'object'
			for k of b
				if !a.hasOwnProperty(k)
					a[k] = b[k]
		return a

	@clone:(p_target)->
		try
			if !p_target or typeof p_target isnt 'object'
				return p_target

			copy = null
			if p_target instanceof Array
				copy = []
				i = 0
				len = p_target.length
				while i < len
					copy[i] = @clone(p_target[i])
					i++
				return copy

			if p_target instanceof Object
				copy = {}
				for k, v of p_target
					if v isnt 'object'
						copy[k] = v
					else
						copy[k] = @clone(v)
				return copy

		catch err
			return JSON.parse(JSON.stringify(p_target))

	@replaceValue:(p_obj, p_value, p_newvalue, p_clone=true)->
		resp = []
		# p_obj = if p_clone then ObjectUtils.clone(p_obj) else p_obj
		for k, v of p_obj
			if v == p_value
				p_obj[k] = p_newvalue
				resp.push p_obj
			if typeof(v) == 'object'
				resp = [].concat resp, ObjectUtils.replaceValue(v, p_value, p_newvalue, p_clone)
		return resp
		
	@hasSameKey:(p_a, p_b)->
		return if Object.getOwnPropertyNames(p_a)[0] == Object.getOwnPropertyNames(p_b)[0] then true else false

	@isEqual:(p_a, p_b)->
		return JSON.stringify(p_a) == JSON.stringify(p_b)

	# Public: Return a mapped {Array} of a {Array} item.
	#
	# source -  The {Array} object.
	#
	# Returns
	#   The resulting {Array}.
	#
	# Example
	#	ObjectUtils.parseLinkedArray([['id', 'name'], [0, 'name1'], [1, 'name2']])
	#	// [{id: 0, 'name': 'name1'}, {id: 1, 'name': 'name2'}]
	@parseLinkedArray:(p_source)->
		if !p_source or (p_source and p_source.length < 1)
			return []
		i = p_source.length
		names = p_source[0]
		numNames = names.length
		ret = []
		while i-- > 1
			o = {}
			j = numNames
			item = p_source[i]
			while j-- > 0
				o[names[j]] = item[j]
			ret[i - 1] = o
		return ret

