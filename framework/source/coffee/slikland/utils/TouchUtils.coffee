class TouchUtils
	@getTouchPositions:(evt)->
		if evt.touches
			touches = evt.touches
		else
			touches = [{pageX: evt.pageX, pageY: evt.pageY}]
		i = touches.length
		tPos = []
		sl = document.body.scrollLeft
		st = document.body.scrollTop
		while i-- > 0
			tPos[i] = [touches[i].pageX - sl, touches[i].pageY - st]
		return tPos