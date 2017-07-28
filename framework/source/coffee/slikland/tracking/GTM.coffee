class GTM

	constructor:(p_id)->
		

	# Track
	#
	track:(p_event, p_category, p_action, p_label, p_value)->
		false

	# Track event
	#
	event:(p_args...)=>
		false

	# Track pageview
	#
	pageview:(p_args...)->
		false
		# console.log("TRACKING: PAGEVIEW", p_args)
