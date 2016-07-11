#import slikland.anim.BaseAnimation
#import slikland.display.BaseDOM
class SpriteSheetAnimation extends BaseAnimation

	@_init:()->
		head = document.querySelector("head") || document.getElementsByTagName("head")[0]
		css = '.animation.spritesheet{display: inline-block;position: relative;font-size:0px;}'
		style = document.createElement('style')
		style.type = "text/css"
		head.appendChild(style)
		si = head.querySelectorAll('style').length

		try
			style.appendChild(document.createTextNode(css))
		catch e
			if document.all
				document.styleSheets[si].cssText = css

	@_init()
	###*
	Spritesheet Animation class
	@class SpriteSheetAnimation
	@constructor
	@extends BaseAnimation
	@param {Object} data Object defining spritesheet.
	###
	constructor:(data)->
		if !data.image?
			throw new Error('data.image is not set')
		if !(data.json)
			throw new Error('data.json is not set')
		image = data.image.tag || data.image
		json = data.json.tag || data.json

		if !(image instanceof Image || image.tagName?.toLowerCase() == 'img')
			throw new Error('data.image is not Type of Image')

		super
		@addClass('spritesheet')
		
		@_frames = @_parseJson(json)
		@_totalFrames = @_frames.length
		@_useBackground = data.background || false

		@_holder = new BaseDOM({element: 'div'})
		@_holder.css({
			display: 'inline-block'
			width: @_size.w + 'px'
			height: @_size.h + 'px'
		})
		@appendChild(@_holder)

		@_container = new BaseDOM({element: 'div'})
		@_container.css({
			display: 'inline-block'
			position: 'absolute'
			overflow: 'hidden'
		})
		@appendChild(@_container)

		if @_useBackground
			@_setupBackground(image)
			@_redraw = @_redrawBackground
		else
			@_setupImage(image)
			@_redraw = @_redrawImage

	_parseJson:(data)->
		frames = []
		# "filename": "Symbol 20000",
		# "frame": {"x":10,"y":10,"w":97,"h":64},
		# "rotated": false,
		# "trimmed": true,
		# "spriteSourceSize": {"x":14,"y":0,"w":132,"h":64},
		# "sourceSize": {"w":132,"h":64}
		@_imageSize = data.meta.size
		trimmed = false
		maxWidth = Number.MIN_VALUE
		maxHeight = Number.MIN_VALUE
		i = 0
		for f in data.frames
			sw = f.sourceSize.w
			sh = f.sourceSize.h
			isw = 1 / sw
			ish = 1 / sh
			fo = {}
			fo.source = f.frame
			fo.proportionalSource = {x: (-(f.frame.x / f.frame.w) * 100).toString() + '%', y: (-(f.frame.y / f.frame.h) * 100).toString() + '%', w: ((@_imageSize.w / f.frame.w) * 100).toString() + '%', h: ((@_imageSize.h / f.frame.h) * 100).toString() + '%'}
			fo.output = {x: f.spriteSourceSize.x, y: f.spriteSourceSize.y, w: f.frame.w, h: f.frame.h}
			fo.proportionalOutput = {x: f.spriteSourceSize.x * isw, y: f.spriteSourceSize.y * ish, w: f.frame.w * isw, h: f.frame.h * ish}
			if maxWidth < sw
				maxWidth = sw
			if maxHeight < sh
				maxHeight = sh
			frames[i++] = fo
		@_size = {w: maxWidth, h: maxHeight}
		i = frames.length
		while i-- > 0
			fo = frames[i]
			fo.output.x = ((fo.output.x / maxWidth) * 100).toString() + '%'
			fo.output.y = ((fo.output.y / maxHeight) * 100).toString() + '%'
			fo.output.w = ((fo.output.w / maxWidth) * 100).toString() + '%'
			fo.output.h = ((fo.output.h / maxHeight) * 100).toString() + '%'
		return frames

	_setupImage:(image)->
		@_image = image.cloneNode()
		@_image.style.position = 'absolute'
		@_image.style.display = 'inline-block'
		@_image.style.width = (@_imageSize.w / @_size.w) * 100 + '%'
		@_image.style.height = (@_imageSize.h / @_size.h) * 100 + '%'
		@_container.appendChild(@_image)
	_setupBackground:()->

	_redrawImage:()=>
		fd = @_frames[@_currentFrame]
		if !fd
			return
		@_container.css({
			left: fd.output.x
			top: fd.output.y
			width: fd.output.w
			height: fd.output.h
		})
		b = @_container.getBounds()

		@_image.style['left'] = fd.proportionalSource.x
		@_image.style['top'] = fd.proportionalSource.y
		@_image.style['width'] = fd.proportionalSource.w
		@_image.style['height'] = fd.proportionalSource.h

		# console.log(@)
		# console.log(1)
		# console.log(window.getComputedStyle(@element))
		# @stop()

	_redrawBackground:()=>
		console.log(2)
		@html = @_currentFrame
		console.log(@_currentFrame)


