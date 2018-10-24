class EventDispatcher

	# Collection of {Event}
	_events:null

	# Add the event
	#
	# event - {String} to the event
	# handler - {Function} to the handler
	on:(p_event, p_handler)->
		if !@_events then @_events = {}
		if !@_events[p_event] then @_events[p_event] = []
		if !(p_handler in @_events[p_event])
			@_events[p_event].unshift(p_handler)

	# Remove the event
	#
	# event - {String} to the event
	off:(p_event=null, p_handler=null)->
		if !@_events
			@_events = {}
			return

		if !p_event
			@offAll()
			return

		if events = @_events[p_event]
			if !p_handler
				@_events[p_event].length = 0
			else
				while (i = events.indexOf(p_handler)) >= 0
					events.splice(i, 1)
				@_events[p_event] = events
		else if !p_event
			@offAll()

	# Remove all events
	offAll:()->
		@_events = {}
		false

	# Trigger the custom events
	#
	# event - {String} to the event
	# data  - {Object} to the data
	trigger:(evt, data = null, target = null)=>
		if Array.isArray(evt)
			for e in evt
				@trigger(evt, data)
			return
		if !@_events
			@_events = {}
		events = @_events[evt]
		if !events || events.length == 0
			return
		if !target
			target = @
		e = {type: evt, target: target, currentTarget: @}
		if typeof(data) == 'object'
			for k, v of data
				if !e[k]
					e[k] = v
		i = events.length
		while i-- > 0
			events[i]?(e, data)


	# Trigger the native events
	#
	# event - {Event} to the native event
	_triggerNative:(p_event)=>
		if !@_events then @_events = {}
		events = @_events[p_event.type]
		if !events or events.length is 0 then return
		i = events.length
		p_event.targetClass = @
		while i-- > 0
			events[i]?(p_event)

	# Check if the event already exists
	#
	# event - {String} to the event
	# handler - {Function} to the handler
	hasEvent:(p_event, p_handler)->
		for event of @_events
			if event is p_event
				if @_events[event].indexOf(p_handler) > -1
					return true
		return false
