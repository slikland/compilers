class RouteUtils

	@getInstance:()=>
		@_instance ?= new @(arguments...)

	setup:(views)->
		@_routes = []
		@_numRoutes = 0
		for k, v of views
			if v.route then @addRoute(v.route)

	addRoute:(p_route, p_data = null)->
		if typeof(p_route)!='string'
			i = p_route.length
			while i-- > 0
				@addRoute(p_route[i], p_data)

		r = /\{(.*?)\}/g
		labels = []
		p = 0	
		while o = r.exec(p_route)
			labels[p++] = o[1]
		r = p_route
		if r == '*' then r = '.*'

		try
			r = r.replace(/(.*?)\/*$/, '$1')
			routeRE = new RegExp('(?:' + r.replace(/\{.*?\}/g, '(.+?)') + '$)', 'g')
		catch err
			console.log err.stack
			return

		@_routes[@_numRoutes++] =
			data: p_data,
			route: p_route,
			routeRE: routeRE,
			labels: labels,
			numLabels: labels.length,
			numSlashes: p_route.split('/').length
		@_routes.sort(@_sortRoutes)

	parsePath:(p_rawPath)->
		pathParts = /^(?:#?!?\/*)([^?]*)\??(.*?)$/.exec(p_rawPath)
		path = pathParts[1]
		params = @_parseParams(pathParts[2])
		return {rawPath: p_rawPath, path: path, params: params}

	checkRoute:(p_path)->
		i = @_numRoutes
		foundRoute = null
		data = null
		routes = []
		routesIndex = 0
		p_path = '/' + p_path

		while i-- > 0
			route = @_routes[i]
			if foundRoute
				if route.route == foundRoute
					routes[routesIndex++] = route
				else
					break
			re = route.routeRE
			re.lastIndex = 0

			if !(o = re.exec(p_path))
				continue

			data = {}
			routes[routesIndex++] = route
			foundRoute = route.route
			for label, j in route.labels
				v = o[j * 2 + 1]
				data[label] = v

		for k, v of data
			data[k] = v.replace(/\?.*$/gi, '') if v
		
		return [routes, data]

	getViewIdByRoute:(p_value)=>
		for k, view of app.config.views
			if view.route? && view.route is p_value
				return view.id
		return null

	# Private
	#------------------------------------------
	_parseParams:(p_path)->
		params = {}
		if p_path
			pRE = /&?([^=&]+)=?([^=&]*)/g
			c = 0
			while o = pRE.exec(p_path)
				params[o[1]] = o[2]
		return params
		
	_sortRoutes:(p_a, p_b)->
		if p_a.numLabels < p_b.numLabels
			return -1
		if p_a.numLabels > p_b.numLabels
			return 1
		if p_a.numSlashes < p_b.numSlashes
			return -1
		if p_a.numSlashes > p_b.numSlashes
			return 1
		if p_a.route == p_b.route
			return 0
		if p_a.route < p_b.route
			return -1
		if p_a.route > p_b.route
			return 1
		return 0
