#namespace slikland.erlik.ui.image
class Cropper extends BaseDOM

	@_GRID_IMAGE: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKAQMAAAC3/F3+AAAABlBMVEUAAADMzMzIT8AyAAAAAXRSTlMAQObYZgAAABBJREFUCNdj+H+AoYEBFwIAcQEGQFVLmEYAAAAASUVORK5CYII='
	@_EMPTY_IMAGE: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII='

	@WIDTH: 760
	@HEIGHT: 401

	constructor:()->
		super({element: 'div', className: 'cropper'})
		@_container = new BaseDOM({element: 'div', className: 'cropper_container'})
		@_container.css({
			'background-image': 'url('+@constructor._GRID_IMAGE+')'
			display: 'block'
			width: @constructor.WIDTH + 'px'
			height: @constructor.HEIGHT + 'px'
		})
		@_image = document.createElement('img')
		@_image.className = 'cropper_image'
		@_image.addEventListener('load', @_imageLoaded)
		@_container.appendChild(@_image)

		@_cropperMask = new Mask()
		@_cropperMask.on('update', @_maskUpdate)
		@_container.appendChild(@_cropperMask)

		@appendChild(@_container)

		@_gallery = new Gallery()
		@_gallery.on('change', @_galleryChange)
		@appendChild(@_gallery)

	getData:()->
		return @_gallery.getItems()

	_galleryChange:(e, data)=>
		@_cropperMask.aspectRatio = data.aspectRatio
		@_cropperMask.update(data.bounds.x, data.bounds.y, data.bounds.w, data.bounds.h)
	_maskUpdate:(e, data)=>
		@_gallery.updateSelected(data.bounds)
	setImage:(url)->
		@_image.src = url
		@_url = url
		@_gallery.setImage(@_url)

	_imageLoaded:()=>
		@_imageWidth = @_image.initialWidth || @_image.naturalWidth || @_image.width
		@_imageHeight = @_image.initialHeight || @_image.naturalHeight || @_image.height

		s = @constructor.WIDTH / @constructor.HEIGHT
		if s < @_imageWidth / @_imageHeight
			s = @constructor.WIDTH / @_imageWidth
		else
			s = @constructor.HEIGHT / @_imageHeight
		w = s * @_imageWidth
		h = s * @_imageHeight
		@_cropperMask.imageSize(w / @constructor.WIDTH, h / @constructor.HEIGHT)
		@_image.style['left'] = (@constructor.WIDTH - w) * 0.5 + 'px'
		@_image.style['top'] = (@constructor.HEIGHT - h) * 0.5  + 'px'
		@_image.style['width'] = w + 'px'
		@_image.style['height'] = h + 'px'

	setSizes:(sizes)->
		@_gallery.setSizes(sizes)
		if @_url
			@_gallery.setImage(@_url)

	class Mask extends BaseDOM
		constructor:()->
			super({element: 'div', className: 'cropper_mask'})
			@_aspectRatio = 1
			@_topMask = new BaseDOM({element: 'div', className: 'cropper_mask_item'})
			@_leftMask = new BaseDOM({element: 'div', className: 'cropper_mask_item'})
			@_bottomMask = new BaseDOM({element: 'div', className: 'cropper_mask_item'})
			@_rightMask = new BaseDOM({element: 'div', className: 'cropper_mask_item'})
			@_middleMask = new BaseDOM({element: 'div', className: 'cropper_mask_dragger'})
			@_middleMask.element.on('mousedown', @_startDrag)
			@_middleMask.css({
				'background-image': 'url('+Cropper._EMPTY_IMAGE+')'
			})

			@appendChild(@_topMask)
			@appendChild(@_leftMask)
			@appendChild(@_bottomMask)
			@appendChild(@_rightMask)
			@appendChild(@_middleMask)

			@_dragTL = new BaseDOM({element: 'div', className: 'cropper_mask_resizer tl'})
			@_dragTR = new BaseDOM({element: 'div', className: 'cropper_mask_resizer tr'})
			@_dragBL = new BaseDOM({element: 'div', className: 'cropper_mask_resizer bl'})
			@_dragBR = new BaseDOM({element: 'div', className: 'cropper_mask_resizer br'})

			@_dragTL.attr('type', 'tl')
			@_dragTR.attr('type', 'tr')
			@_dragBL.attr('type', 'bl')
			@_dragBR.attr('type', 'br')

			@_dragTL.element.on('mousedown', @_resizeDown)
			@_dragTR.element.on('mousedown', @_resizeDown)
			@_dragBL.element.on('mousedown', @_resizeDown)
			@_dragBR.element.on('mousedown', @_resizeDown)

			@appendChild(@_dragTL)
			@appendChild(@_dragTR)
			@appendChild(@_dragBL)
			@appendChild(@_dragBR)

			@update(0, 0, 1, 1)


		@get aspectRatio:()->
			return @_aspectRatio
		@set aspectRatio:(value)->
			@_aspectRatio = value
			@_dirty = true


		@set _dirty:(value)->
			if !value
				return
			clearTimeout(@_dirtyCallback)
			@_dirtyCallback = setTimeout(@_redraw, 0)

		_getMousePos:(e)->
			x = e.pageX || e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft
			y = e.pageY || e.clientY + document.body.scrollTop + document.documentElement.scrollTop
			x -= @x
			y -= @y
			return [x, y]

		_startDrag:(e)=>
			@_mousePos = @_getMousePos(e)
			window.addEventListener('mousemove', @_drag)
			window.addEventListener('mouseup', @_stopDrag)
		_drag:(e)=>
			e.preventDefault()
			e.stopImmediatePropagation()

			p = @_getMousePos(e)
			w = @width
			h = @height
			@_x += ((p[0] - @_mousePos[0]) / w) / @_imageWidth
			@_y += ((p[1] - @_mousePos[1]) / h) / @_imageHeight
			@_dirty = true

			@_mousePos = p

		_stopDrag:()=>
			window.removeEventListener('mousemove', @_drag)
			window.removeEventListener('mouseup', @_stopDrag)

		_resizeDown:(e)=>
			window.addEventListener('mousemove', @_resizeMove)
			window.addEventListener('mouseup', @_resizeUp)

			@_resizeType = e.currentTarget.getAttribute('type')
			@_resizePos = @_getMousePos(e)

		_resizeMove:(e)=>
			e.preventDefault()
			e.stopImmediatePropagation()

			p = @_getMousePos(e)
			x = @_x
			y = @_y
			w = @_w
			h = @_h

			top = y
			bottom = y + h
			left = x
			right = x + w

			ox = (1 - @_imageWidth) * 0.5
			oy = (1 - @_imageHeight) * 0.5

			px = ((p[0] / @width) - ox) / @_imageWidth
			py = ((p[1] / @height) - oy) / @_imageHeight

			t = @_resizeType.split('')
			i = t.length
			while i-- > 0
				switch t[i]
					when 't'
						top = py
					when 'b'
						bottom = py
					when 'l'
						left = px
					when 'r'
						right = px

			w = right - left
			h = bottom - top

			if w / h > @_aspectRatio
				w = h * @_aspectRatio
			else
				h = w / @_aspectRatio

			i = t.length
			while i-- > 0
				switch t[i]
					when 't'
						top = bottom - h
						if top + h > 1
							top = 1 - h
							bottom = 1
					when 'b'
						bottom = top + h
						if bottom - h < 0
							top = 0
							bottom = top + h
					when 'l'
						left = right - w
						if left + w > 1
							left = 1 - w
							right = 1
					when 'r'
						right = left + w
						if right - w < 0
							left = 0
							right = left + w

			@_x = left
			@_y = top
			@_w = w
			@_h = h

			@_dirty = true
			@_resizePos = p

		_resizeUp:(e)=>
			window.removeEventListener('mousemove', @_resizeMove)
			window.removeEventListener('mouseup', @_resizeUp)

		imageSize:(w, h)->
			@_imageWidth = w
			@_imageHeight = h
			@_minX = (1 - @_imageWidth) * 0.5
			@_minY = (1 - @_imageHeight) * 0.5
			@_dirty = true

		reset:()->
			@update(0, 0, 1, 1)

		update:(x, y, w, h)->
			@_x = x
			@_y = y
			@_w = w
			@_h = h
			@_dirty = true

		_redraw:()=>
			if isNaN(@_x) || isNaN(@_y) || isNaN(@_w) || isNaN(@_h) || isNaN(@_imageWidth) || isNaN(@_imageHeight)
				return
			x = @_x
			y = @_y
			w = @_w
			h = @_h
			if x < 0
				x = 0
			if y < 0
				y = 0
			if w > 1
				w = 1
			if h > 1
				h = 1

			if w < 0.1
				w = 0.1
				h = w / @_aspectRatio

			if w / h != @_aspectRatio
				cx = w * 0.5 + x
				cy = h * 0.5 + y
				if w / h > @_aspectRatio
					w = h * @_aspectRatio
				if h
					h = w / @_aspectRatio
				x = cx - w * 0.5
				y = cy - h * 0.5

			if x < 0
				x = 0
			if x + w > 1
				x = 1 - w
			if y < 0
				y = 0
			if y + h > 1
				y = 1 - h

			@_x = x
			@_y = y
			@_w = w
			@_h = h

			@stackTrigger('update', {bounds: {x: x, y: y, w: w, h: h}})

			x *= @_imageWidth
			y *= @_imageHeight
			x += @_minX
			y += @_minY
			w *= @_imageWidth
			h *= @_imageHeight

			@_dragTL.css({
				left: x * 100 + '%'
				top: y * 100 + '%'
			})

			@_dragTR.css({
				left: (x + w) * 100 + '%'
				top: y * 100 + '%'
			})

			@_dragBL.css({
				left: x * 100 + '%'
				top: (y + h) * 100 + '%'
			})

			@_dragBR.css({
				left: (x + w) * 100 + '%'
				top: (y + h) * 100 + '%'
			})

			@_middleMask.css({
				left: x * 100 + '%'
				top: y * 100 + '%'
				width: w * 100 + '%'
				height: h * 100 + '%'
			})

			@_topMask.css({
				top: 0
				left: 0
				width: '100%'
				height: y * 100 + '%'
			})

			@_leftMask.css({
				top: y * 100 + '%'
				left: 0
				width: x * 100 + '%'
				bottom: 0
			})

			@_bottomMask.css({
				top: (y + h) * 100 + '%'
				left: x * 100 + '%'
				right: 0
				bottom: 0
			})

			@_rightMask.css({
				left: (x + w) * 100 + '%'
				top: y * 100 + '%'
				right: 0 + '%'
				height: h * 100 + '%'
			})
	class Gallery extends BaseDOM
		constructor:()->
			super({element: 'div', className: 'cropper_gallery'})
			@_items = []

		setSizes:(sizes)->
			@reset()

			l = sizes.length
			i = -1
			while ++i < l
				t = new Thumb(sizes[i])
				t.on('select', @_thumbSelect)
				t.on('active', @_thumbActive)
				@appendChild(t)
				@_items[i] = t
			@selectByIndex(0)

		getItems:()->
			items = []
			i = @_items.length
			while i-- > 0
				o = {}
				thumb = @_items[i]
				o.id = thumb.data.id
				o.size = thumb.data.size
				o.bounds = thumb.bounds
				items[i] = o
			return items

		updateSelected:(bounds)=>
			if !@_activeThumb
				return
			@_activeThumb.bounds = bounds

		setImage:(url)->
			i = @_items.length
			while i-- > 0
				@_items[i].setImage(url)

		reset:()->
			i = @_items.length
			while i-- > 0
				@removeChild(@_items[i])
				@_items[i].off()
				@_items[i].destroy?()
			@_items.length = 0
		selectByIndex:(index)->
			l = @_items.length
			index = ((index % l) + l) % l
			i = @_items.length
			while i-- > 0
				@_items[i].selected = i == index

		_thumbSelect:(e)=>
			i = @_items.length
			while i-- > 0
				@_items[i].selected = (@_items[i] == e.currentTarget)

		_thumbActive:(e)=>
			target = e.currentTarget
			@_activeThumb = target
			@trigger('change', {bounds: target.bounds, aspectRatio: target.aspectRatio})

	class Thumb extends BaseDOM
		constructor:(data)->
			@_data = data
			@_selected = false
			super({element: 'div', className: 'cropper_thumb'})
			@css({
				'display': 'inline-block'
			})
			@_thumbContainer = new BaseDOM({className: 'container'})
			@_thumbContainer.addClass('align_center')
			@_thumbContainer.addClass('align_middle')
			@_thumbImage = new BaseDOM({})
			@_thumbContainer.appendChild(@_thumbImage)
			@appendChild(@_thumbContainer)

			x = data.x || data.bounds?.x || 0
			y = data.y || data.bounds?.y || 0
			w = data.w || data.bounds?.w || 1
			h = data.h || data.bounds?.h || 1
			@_aspectRatio = data.size[0] / data.size[1]

			if @_aspectRatio > 1
				aw = 1
				ah = 1 / @_aspectRatio
			else
				aw = @_aspectRatio
				ah = 1

			@_aspectWidth = aw
			@_aspectHeight = ah
			@_thumbImage.css({
				'display': 'inline-block'
				'width': aw * 100 + '%'
				'height': ah * 100 + '%'
			})

			@_labelContainer = new BaseDOM({className: 'label'})
			@appendChild(@_labelContainer)
			@_labelContainer.html = data.name + ' ('+data.size[0]+'x'+data.size[1]+')'

			if w / h != @_aspectRatio
				cx = x + w * 0.5
				cy = y + h * 0.5
				if w / h != @_aspectRatio
					cx = w * 0.5 + x
					cy = h * 0.5 + y
					if w / h > @_aspectRatio
						w = h * @_aspectRatio
					if h
						h = w / @_aspectRatio
					x = cx - w * 0.5
					y = cy - h * 0.5

			@update(x, y, w, h)

			@element.on('click', @_click)

		@get data:()->
			return @_data

		@get aspectRatio:()->
			return @_aspectRatio

		@get bounds:()->
			return {x: @_x, y: @_y, w: @_w, h: @_h}
		@set bounds:(value)->
			@update(value.x, value.y, value.w, value.h)

		@get selected:()->
			return @_selected

		@set selected:(value)->
			@_selected = value
			@toggleClass('selected', @_selected)
			if @_selected
				@trigger('active')

		_click:()=>
			@trigger('select')
		setImage:(url)->
			@_thumbImage.css({
				'background-image': 'url('+url+')'
			})
		update:(x, y, w, h)->
			@_x = x
			@_y = y
			@_w = w
			@_h = h

			x /= (1 - w)
			y /= (1 - h)
			if isNaN(x)
				x = 0
			if isNaN(y)
				y = 0
			w = 1 / @_w
			h = 1 / @_h


			@_thumbImage.css({
				'background-size': w * 100 + '% ' + h * 100 + '%'
				'background-position': x * 100 + '% ' + y * 100 + '%'
			})
