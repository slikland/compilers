#import erlik.plugins.Plugin
#import erlik.ui.image.Cropper
#import slikland.net.API
#namespace slikland.erlik.plugins.media

class Image extends slikland.erlik.plugins.Plugin

	@PLUGIN_NAME = 'image'

	@elementSelector = 'image'
	_toolbar: {
		icon: 'fa-image'
		toggle: false
		tooltip: 'imagem'
	}

	_command: 'insertElement'
	# @const TEST: 'bla2'


	constructor:()->
		super
		@_elements = {}
		@_form = document.createElement('form')
		@_form.enctype = 'multipart/form-data'
		@_form.style['position'] = 'absolute'
		@_form.style['left'] = '-100000px'
		@_form.style['opacity'] = 0
		@_browser = document.createElement('input')
		@_browser.setAttribute('type', 'file')
		@_browser.setAttribute('accept', 'image/*')
		@_browser.on('change', @_browserChange)
		@_browser.name = 'image'
		@_form.appendChild(@_browser)
		document.body.appendChild(@_form)

	_resetValues:()->
		@_cropData = null
		@_currentElement = null
		@_browser.value = null

	_toolbarClick:()=>
		# super
		@_resetValues()
		@_browser.click()

	_showLightbox:(data, sizes = null)->
		if sizes
			i = sizes.length
			while i-- > 0
				size = @_controller.config.image?.types[i]
				if size
					sizes[i].name = size.name
		else
			sizes = @_controller.config.image?.types
		@_lightboxContent = new @constructor.Lightbox(data, sizes || @_controller.config.image?.types)
		@_lightboxContent.on(@_lightboxContent.constructor.COMMIT, @_lightboxCommit)
		@_lightboxContent.on(@_lightboxContent.constructor.CANCEL, @_lightboxCancel)
		@_lightbox = slikland.erlik.ui.Lightbox.open({
			title: 'Image'
			content: @_lightboxContent
		})

		@_lightbox.on(slikland.erlik.ui.Lightbox.CLOSE, @_lightboxCancel)
	_closeLightbox:()->
		@_lightboxContent?.off(@_lightboxContent.constructor.COMMIT, @_lightboxCommit)
		@_lightboxContent?.off(@_lightboxContent.constructor.CANCEL, @_lightboxCancel)
		@_lightbox?.off(slikland.erlik.ui.Lightbox.CLOSE, @_lightboxCancel)

		@_lightboxContent?.destroy?()
		@_lightbox?.destroy?()

		
	_browserChange:()=>
		if !@_browser.files || @_browser.files?.length == 0
			return
		@_showLightbox(@_browser.files[0])


	_lightboxCancel:()=>

	_lightboxCommit:(e, data)=>
		@_cropData = data
		if @_browser.value
			@_uploadImage()
		else
			@_cropData.image = @_currentElement.data.image
			@_cropImage()
		@_lightbox.close()

	_uploadImage:()->
		@_uploadProgress = new slikland.erlik.ui.ProgressBlocker()
		@_uploadProgress.progress = 0
		@_uploadProgress.title = "Uploading image"
		@_uploadProgress.open()


		fd = new FormData(@_form)
		api = new API('api/image/upload', fd)
		api.on(API.PROGRESS, @_uploadProgressHandler)
		api.on(API.COMPLETE, @_uploadCompleteHandler)
		api.load()

	_uploadProgressHandler:(e, data)=>
		p = data.loaded / data.total
		@_uploadProgress.progress = p
		p = Math.round(p * 100)
		@_uploadProgress.text = p + '%'

	_uploadCompleteHandler:(e, data)=>
		@_uploadProgress.progress = 1
		@_cropData.image = data.url

		@_cropImage()

	_cropImage:()=>
		@_uploadProgress ?= new slikland.erlik.ui.ProgressBlocker()
		@_uploadProgress.open()
		@_uploadProgress.progress = Number.NaN
		@_uploadProgress.title = "Cropping image"
		@_uploadProgress.text = ''

		api = new API('api/image/crop', @_cropData)
		api.on(API.COMPLETE, @_cropCompleteHandler)
		api.load()
	_cropCompleteHandler:(e, data)=>
		console.log("CROPPED!")
		@_uploadProgress.close()
		console.log(@_currentElement)
		if !@_currentElement
			@_currentElement = new @constructor.Element(data)
			@_registerElement(@_currentElement)
		else
			console.log(@_currentElement)
			@_currentElement.update(data)

		@_triggerChange({element: @_currentElement})

	_registerElement:(element)->
		if element instanceof @constructor.Element
			target = element.element
		else
			target = element
			if @_elements[target]
				element = @_elements[target]
			else
				element = new @constructor.Element(target)
		if @_elements[target]
			return
		element.editor = @_editor
		@_elements[target] = element
	edit:(element)->
		@_resetValues()
		@_currentElement = element
		@_showLightbox(element.image.src, element.data.sizes)
	parseElement:(dom)->
		children = dom.childNodes
		classNames = @constructor.PLUGIN_NAME.replace(/(^|\s)*([^\s]+)/g, '.$2')
		items = dom.querySelectorAll(classNames)
		i = items.length
		while i-- > 0
			item = items[i]
			@_registerElement(item)

	class @Element extends BaseDOM
		constructor:(data, target = null)->
			if data instanceof HTMLElement
				target = data
			if !target
				target = 'div'
			super({element: target})

			@addClass(Image.PLUGIN_NAME)

			@element.contentEditable = false
			@attr('tabindex', 0)			
			@addClass('media-item')
			@element.on('click', @_click)
			@element.on('focus', @_focus)
			@element.on('dblclick', @_dblClick)

			if data instanceof HTMLElement
				@_buildFromElement(data)
			else
				@_buildFromObject(data)

		@get image:()->
			return @_image
		@get data:()->
			return @_data

		update:(data)->
			@_reset()
			@_buildFromObject(data)

		_reset:()->
			@removeAll()

		_loadImage:(src)->
			@_image = document.createElement('img')
			@_image.loaded = false
			@_image.onload = @_imageLoaded
			@_image.src = src

		_buildFromElement:(element)->
			@_data = JSON.parse(decodeURIComponent(@attr('data')))
			@_loadImage(@_data.image)
			return
		_imageLoaded:(e)=>
			@_image.loaded = true

		_buildFromObject:(data)->
			@_data = data
			@_loadImage(@_data.image)
			@attr('data', encodeURIComponent(JSON.stringify(data)))

			for size in data.sizes
				img = document.createElement('img')
				img.className = 'item'
				img.src = size.url + '?r=' + new Date().now + '_' + Math.random()
				@appendChild(img)

		_click:()=>
			@_element.focus()
		_focus:()=>
			@trigger('focus')
		_dblClick:()=>
			@editor.trigger(slikland.Erlik.EDIT_PLUGIN, @)


	class @Lightbox extends BaseDOM
		@COMMIT: 'commit'
		@CANCEL: 'cancel'

		constructor:(file, sizes)->
			super({element: 'div'})
			@_cropper = new slikland.erlik.ui.image.Cropper()
			if typeof(file) != 'string'
				file = URL.createObjectURL(file)
			@_cropper.setImage(file)
			if sizes
				@_cropper.setSizes(sizes)
			@appendChild(@_cropper)

			@_buttonContainer = new BaseDOM({})
			@_buttonContainer.css({
				'display': 'block'
				width: '100%'
				'text-align': 'right'
			})

			@_okButton = new slikland.erlik.ui.Button({label: 'OK'})
			@_okButton.on(slikland.erlik.ui.Button.CLICK, @_okClick)
			@_buttonContainer.appendChild(@_okButton)

			@appendChild(@_buttonContainer)
		_okClick:(e)=>
			o = {sizes: JSON.stringify(@_cropper.getData())}
			@trigger(@constructor.COMMIT, o)
