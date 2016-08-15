#namespace slikland.erlik.ui
class Lightbox extends BaseDOM
	@CLOSE: 'close'

	@_instances = []
	@open:(content = null)->
		instance = new Lightbox(content)
		instance.open()
		return instance
	@closeAll:()->
		i = @_instances.length
		while i-- > 0
			@_instances[i].close()
		@_instances.length = 0
	@_registerInstance:(instance)->
		@_instances.push(instance)
	@_unregisterInstance:(instance)->
		while (i = @_instances.indexOf(instance)) >= 0
			@_instances.splice(i, 1)[0]?.destroy()

	constructor:(data)->
		@_toggle = false
		super({element: 'div', className: 'erlik_lightbox'})
		@_prevContentSize = [0, 0]
		@constructor._registerInstance(@)

		@_contentWrapper = new BaseDOM({element: 'div', className: 'erlik_lightbox_wrapper'})
		@appendChild(@_contentWrapper)

		@_header = new BaseDOM({element: 'div', className: 'erlik_lightbox_header'})

		@_title = new BaseDOM({element:'span', className: 'erlik_lightbox_title'})
		@_title.html = data.title || ''
		@_header.appendChild(@_title)

		@_closeBtn = new slikland.erlik.ui.Button({icon: 'fa-close'})
		@_closeBtn.element.on('click', @close)
		@_closeBtn.addClass('close_btn')
		@appendChild(@_closeBtn)
		@_header.appendChild(@_closeBtn)


		@_contentWrapper.appendChild(@_header)
		if data.width?
			@_contentWrapper.css('width', data.width)
		if data.height?
			@_contentWrapper.css('height', data.height)

		@_container = new BaseDOM({element: 'div', className: 'erlik_lightbox_container'})
		if data.content
			@_content = data.content
			@_container.appendChild(data.content)
		@_contentWrapper.appendChild(@_container)


	open:()=>
		document.body.appendChild(@element)
		@_watchContainerSize()

	close:()=>
		@trigger(@constructor.CLOSE)
		@element.parentNode?.removeChild(@element)
		@constructor._unregisterInstance(@)
		@_unwatchContainerSize()

	destroy:()->
		@_closeBtn.element.off('click', @close)
		super

	_watchContainerSize:()->
		@_checkContainerSize()

	_unwatchContainerSize:()->
		if @_containerSizeWatchAnimationFrame?
			window.cancelAnimationFrame(@_containerSizeWatchAnimationFrame)

	_checkContainerSize:()=>
		setTimeout(@_updateContainerSize, 0)
		@_containerSizeWatchAnimationFrame = window.requestAnimationFrame(@_checkContainerSize)		
	_updateContainerSize:()=>
		if @_content?
			bounds = @_content.getBounds()
			if @_prevContentSize[0] != bounds.width || @_prevContentSize[1] != bounds.height
				@_contentWrapper.css({
					width: ''
					height: ''
				})
				bounds = @_content.getBounds()
				@_contentWrapper.css({
					width: bounds.width + 'px'
					height: (bounds.height + @_header.height) + 'px'
				})
				bounds = @_content.getBounds()
				@_prevContentSize[0] = bounds.width
				@_prevContentSize[1] = bounds.height
				