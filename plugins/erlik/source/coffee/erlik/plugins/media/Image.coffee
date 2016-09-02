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

	_toolbarClick:()=>
		# super
		@_cropData = null
		@_currentElement = null
		@_browser.value = null
		@_browser.click()

	_showLightbox:(data)->
		@_lightboxContent = new @constructor.Lightbox(@_browser.files[0], @_editor.config.image?.types)
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

	_lightboxCancel:()=>

	_lightboxCommit:(e, data)=>
		@_cropData = data
		if @_browser.value
			@_uploadImage()
		else
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
		@_uploadProgress.progress = Number.NaN
		@_uploadProgress.title = "Cropping image"
		@_uploadProgress.text = ''

		api = new API('api/image/crop', @_cropData)
		api.on(API.COMPLETE, @_cropCompleteHandler)
		api.load()
	_cropCompleteHandler:(e, data)=>
		@_uploadProgress.close()
		if !@_currentElement
			@_currentElement = new @constructor.Element(data, @_editor)
			@_registerElement(@_currentElement)
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
	edit:()->
		console.log("LALAAL")
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

		_buildFromElement:(element)->
			return
		_buildFromObject:(data)->
			@attr('data', encodeURIComponent(JSON.stringify(data)))

			for size in data.sizes
				img = document.createElement('img')
				img.className = 'item'
				img.src = size.url
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
			@_cropper.setImage(URL.createObjectURL(file))
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




	# _toolbarClick:()=>
	# 	@_browser.click()



	# update:(styles)->
	# 	for style in styles
	# 		value = style[@_style]
	# 		break
	# 	@_setValue(value)
	# _toolbarClick:()=>
	# 	@_picker.click()

	# _pickerChange:()=>
	# 	@_value = @_picker.value
	# 	@_triggerChange()

	# _setValue:(color)->
	# 	rgbFormat = /rgba?\(([\d\.]+),.*?([\d\.]+),.*?([\d\.]+).*?\)/
	# 	if rgbFormat.test(color)
	# 		o = rgbFormat.exec(color)
	# 		r = Number(o[1]).toString(16).padLeft(2, '0')
	# 		g = Number(o[2]).toString(16).padLeft(2, '0')
	# 		b = Number(o[3]).toString(16).padLeft(2, '0')
	# 		color = '#' + r + g + b
	# 	@_picker.value = @_value = color
	# 	@_toolbarUI?.css?('color', color)
