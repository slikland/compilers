class HomeVideo extends BaseDOM
	@CAN_PLAY: 'canplaytroughHomeVideo'
	@PLAY: 'playHomeVideo'
	@PAUSE: 'pauseHomeVideo'
	@COMPLETE: 'completeHomeVideo'

	constructor: (data) ->
		@_data = data
		super({className: 'home-video'})
	
	create:->
		# Beware: this video is just a temporary solution.
		# @_videoContainer = new BaseDOM
			# className: 'video-player'
			# element: 'video'
		# @appendChild @_videoContainer

		# @_video = @_videoContainer.element

		# @_video.on 'canplaytrough', @_handler
		# @_video.on 'play', @_handler
		# @_video.on 'pause', @_handler
		# @_video.on 'end', @_handler
		# @_video.setAttribute("id", "videoPlayer")
		# @_video.setAttribute("autoplay", "false")
		# @_video.setAttribute("controls", "none")
		# @_video.setAttribute("preload", "none")
		false

	setVideo:(p_video)->
		# @_video?.off 'canplaytrough', @_handler 
		@_video?.off 'play', @_handler
		@_video?.off 'pause', @_handler
		@_video?.off 'ended', @_handler

		@_video = p_video
		@appendChild @_video

		# @_video.on 'canplaytrough', @_handler
		@_video.on 'play', @_handler
		@_video.on 'pause', @_handler
		@_video.on 'ended', @_handler

		@_video.setAttribute("autoplay", "true")
		# @_video.setAttribute("controls", "none")
		@_video.setAttribute("preload", "auto")
		# @_video.setAttribute 'src', p_video
		# @_video.load()
		false

	play:() ->
		@_video?.currentTime = 0
		@_video?.play()
		false
		
	pause:() ->
		@_video.pause()
		false


	_handler:(evt)=>
		switch evt.type
			when 'canplaytrough'
				@trigger HomeVideo.CAN_PLAY
			when 'play'
				@trigger HomeVideo.PLAY
			when 'pause'
				@trigger HomeVideo.PAUSE
			when 'ended'
				@trigger HomeVideo.COMPLETE
		false
	
	_playAgain:(e)=>
		@play()
		false
