#import slikland.utils.SplitTextUtils
#import project.media.HomeVideo

class HomeView extends BaseView

	createStart:(evt=null)=>
		# @a = new BaseDOM({element:"div", className:"blah"})
		# @appendChild(@a)
		
		# @b = new BaseDOM({element:"div", className:"bluh"})
		# @appendChild(@b)
		super

	create:(evt=null)=>
		# @_video = new BaseDOM({className:'xxxxx', element: @loader.getItem('video-test').tag})
		# @_video.element.on 'canplaytrough', @_handler
		# @_video.element.on 'play', @_handler
		# @_video.element.on 'pause', @_handler
		# @_video.element.on 'ended', @_handler
		# @appendChild @_video
		# @_video.element.play()

		

		color = Math.floor(Math.random()*16777215).toString(16)
		@test = new BaseDOM('div')
		@appendChild(@test)
		@test.text = "Lorem <b>ipsum</b> <a href='http://google.com.br'>google</a></b> dolor"
		@test.css({
			'width':'1550px',
			'height':'550px',
			'display': 'table-cell',
			# 'position':'absolute',
			'background-color': '#'+color
		})

		splitText = SplitTextUtils.splitHTMLWords(@test)
		i = splitText.length
		while i-- > 0
			TweenMax.to(splitText[i], 1, {opacity: 0, delay: Math.random() * 2})


		# @_homeVideo = new HomeVideo(@content)
		# @appendChild @_homeVideo
		# @_homeVideo.create()

		# @_homeVideo.setVideo @loader.getResult("video-test")
		# @_homeVideo.play()
		# console.log "home view:", @loader.getItem("video-test")?.tag
		# console.log "home view:", @loader.getItem("audio-test").tag

		# console.log @id, 'create'
		super

	_handler:(evt)=>
		# console.log "evt.type:", evt.type
		false

	createComplete:(evt=null)=>
		TweenMax.set(@test.element,{
			opacity: 0
		})

		# console.log @id, 'createComplete'
		super

	showStart:(evt=null)=>
		# console.log @id, 'showStart'
		super

	show:(evt=null)=>
		TweenMax.to(@test.element, .5, {
			opacity: 1, 
			ease: Quad.easeOut, 
			onComplete: =>
				# console.log @id, 'show'
				super
		})

	showComplete:(evt=null)=>
		# console.log @routeData
		# console.log @id, 'showComplete'
		super

	hideStart:(evt=null)=>
		# console.log @id, 'hideStart'
		super

	hide:(evt=null)=>
		TweenMax.to(@test.element, .5, {
			opacity: 0, 
			ease: Quad.easeOut, 
			onComplete: =>
				# console.log @id, 'hide'
				super
		})

	hideComplete:(evt=null)=>
		# console.log @id, 'hideComplete'
		super

	destroy:(evt=null)=>
		@element.off 'click', @go
		if @test 
			TweenMax.killTweensOf(@test)
			@test.destroy()
			@removeChild(@test)
			@test = null

		if @a 
			@a.destroy()
			@removeChild(@a)
			@a = null
		
		if @b 
			@b.destroy()
			@removeChild(@b)
			@b = null
		
		# console.log @id, 'destroy'
		super

	destroyComplete:(evt=null)=>
		# console.log @id, 'destroyComplete'
		super
