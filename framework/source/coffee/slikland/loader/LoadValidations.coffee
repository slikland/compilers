class LoadValidations

	@getInstance:()=>
		@_instance ?= new @(arguments...)

	constructor:()->
		#route data
		routeUtils = RouteUtils.getInstance()
		pathData = routeUtils.parsePath(location.href.replace(app.root, ''))
		routeData = routeUtils.checkRoute(pathData.path)
		@_initialView = routeUtils.getViewIdByRoute(routeData[0]?[0]?.route)

		#validation
		@_validations = {}
		@addValidation('isMobile', @_isMobile)
		@addValidation('isntMobile', @_isntMobile)
		@addValidation('isTablet', @_isTablet)
		@addValidation('isntTablet', @_isntTablet)
		@addValidation('isPortable', @_isPortable)
		@addValidation('isCurrentPage', @_isCurrentPage)
		@addValidation('breakpoint', @_breakpoint)
		
	# Public
	#---------------------------------------
	addValidation:(name, method)->
		if !@_validations.hasOwnProperty(name)
			@_validations[name] = method
		else
			console.log 'method name,' + name + 'already exists.'
			
	validate:(method, args)->
		if typeof(method) == 'string'
			m = method.split(':')
			methodName = m.shift()
			methodArgs = args.concat(m.slice(0))
			return @_validations[method]?(args...)
		else
			for m in method
				m = m.split(':')
				methodName = m.shift()
				methodArgs = args.concat(m.slice(0))
				return false if !@_validations[methodName]?(methodArgs...)
		return true

	# Private
	#---------------------------------------
	_isMobile:()=>
		return app.dd.mobile

	_isntMobile:()=>
		return !app.dd.mobile

	_isTablet:()=>
		return app.dd.tablet

	_isntTablet:()=>
		return !app.dd.tablet

	_isPortable:()=>
		return !!app.dd.mobile || !!app.dd.tablet

	_isCurrentPage:(view, item, strict)=>
		console.log 'view:',view, ' \n item:',item, 'strict:',strict
		return true if view == true && strict != 'true'
		
		# #fix link
		# link = location.href.replace(app.root, '')
		# link = link.replace(/^(\/)|(#!\/?)|(\/$)|(\?.*)$/gi, '')
		# link = link.replace(/\/.*/gi, '')
		# route = view.route.replace(/^\/|\/$/gi, '')

		# #check
		# if route == link
		# 	return true
		# else if route.indexOf(link) != -1 && link != '' && route != ''
		# 	return true
		
		# console.log item, @_initialView, view.id, item
		return @_initialView == view.id

	_breakpoint:(view, item, value)=>
		resizer = Resizer.getInstance()
		current = resizer.breakpoint
		
		#check
		for bp in resizer.breakpoints by -1
			if value == bp.name
				return true
			if current == bp.name
				return false
		return false
