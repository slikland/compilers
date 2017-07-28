#namespace slikland
#import slikland.display.BaseDOM
#import erlik.*

class Erlik extends BaseDOM
	@EDIT_PLUGIN: 'erlik_edit_plugin'

	@BASE_CSS: """#inject ../stylus/erlik.css"""
	@STYLES: ['display', 'position', 'width', 'height', 'top', 'left', 'bottom', 'right']
	@_init:()->
		if @_inited
			return
		@_inited = true
		@_appendCSS(@BASE_CSS)
		@_checkDependencies()
	@_checkDependencies:()=>
		_cssDependencies = [
			{rule: '.fa', src: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.3/css/font-awesome.min.css'}
		]
		for ss in document.styleSheets
			rules = ss.rules || ss.cssRules
			for r in rules
				for d in _cssDependencies
					if d.found
						continue
					if r.selectorText == d.rule
						d.found = true
		for c in _cssDependencies
			if c.found
				continue
			@_embedCSS(c.src)
	@_embedCSS:(href)->
		link = document.createElement('link')
		link.rel = "stylesheet"
		link.href = href
		head = document.querySelector('head') || document.body
		head.appendChild(link)
	@_appendCSS:(content, container = null)->
		head = document.querySelector('head') || document.body
		if !container?
			container = document.createElement('style')
			container.type = "text/css"
			head.appendChild(container)

			if document.all
				si = head.querySelectorAll('style').length - 1
				container = document.styleSheets[si]
		if document.all
			container.cssText = content
		else
			container.appendChild(document.createTextNode(content))
		return container

	###*

	@class Erlik
	@constructor
	@extends BaseDOM
	@param {HTMLElement | String} [target = null] Target textarea element or querySelector.
	@param {Object} [config = {}] Config object for editor.

	###


	constructor:(target = null, config = {})->
		@constructor._init()

		@_dirtyCallbacks = {}
		@_fonts = []

		if target
			if typeof(target) == 'string'
				if !_target = document.querySelector(target)
					console.warn(target + ' was not found in document.')
			else if target instanceof BaseDOM
				_target = target.element
			else
				_target = target
		if !_target
			_target = document.createElement('textarea')
		@_target = _target

		super({element: 'div', className: 'erlik'})
		@_copyCSS()
		@_target.style.display = 'none'
		if @_target.parentNode
			@_target.parentNode.insertBefore(@element, @_target)
		@element.appendChild(@_target)
		@attr('tabindex', 0)

		@_toolbar = new slikland.erlik.Toolbar()

		@_toolbar.on(slikland.erlik.Toolbar.ITEM_CHANGE, @_toolbarItemChange)
		@appendChild(@_toolbar)

		@_editor = new slikland.erlik.Editor()
		@_editor.value = @_target.innerText
		@_editor.on(slikland.erlik.Editor.UPDATE_SELECTION, @_editorUpdateSelection)
		@_editor.on(slikland.erlik.Editor.DOM_CHANGED, @_domChanged)
		@appendChild(@_editor)

		@_pluginController = new slikland.erlik.core.PluginController(@, @_editor, @_toolbar, config)

		@element.on('focus', @_onFocus)
		@element.on('keyup', @_keyDown)
		
		@_dirty(1)

	@get value:()->
		return @_editor.value

	@set value:(value)->
		@_editor.value = value

	@get dom:()->
		nodes = @_editor.childNodes
		container = document.createElement('div')
		l = nodes.length
		i = -1
		while ++i < l
			container.appendChild(nodes[i].cloneNode(true))

		return container

		
	_keyDown:(e)=>
		e.preventDefault()
	_onFocus:()=>
		@_editor.focus()

	_domChanged:()=>
		@_pluginController.parseDOM(@_editor.element)

	_redraw:()->
		console.log("REDRAW")
		@_editor.css({top: @_toolbar.height + 'px'})
	_dirty:(type)->
		console.log("DIRTY")
		@_dirtyCallbacks[type] = true
		clearTimeout(@_dirtyTimeout)
		@_dirtyTimeout = setTimeout(@_updateDirty, 0)

	_updateDirty:()=>
		for k of @_dirtyCallbacks
			@[k]?()
		@_dirtyCallbacks = {}
		console.log("RE")
		@_redraw()

	_copyCSS:()->
		css = window.getComputedStyle(@_target)
		for k in @constructor.STYLES
			if k == 'position' && css[k] == 'static'
				@element['style'][k] = 'relative'
			else
				@element['style'][k] = css[k]

	_addFonts:()->
		fontNames = []
		fontFaces = []
		for f in @_fonts
			fontNames.push(f.name)
			if f.src
				weight = f.weight || 'normal'
				style = f.style || 'normal'
				fontFace = """@font-face {
					font-family: #{f.name};
					src: url('#{f.src}'), url('#{f.src}?#iefix') format('embedded-opentype'), url('#{f.src}') format('woff'), url('#{f.src}') format('truetype'), url('#{f.src}#0e367a30b984427caad4ff30c417ba64') format('svg');
					font-weight: #{weight};
					font-style: #{style};
				}"""
				fontFaces.push(fontFaces)

		fontFaces = fontFaces.join('\n')
		if @_fontStyleContainer
			@constructor._appendCSS(fontFaces, @_fontStyleContainer)
		else
			@_fontStyleContainer = @constructor._appendCSS(fontFaces)

	addFont:(name, src = null, weight = 'normal', style = 'normal')->
		for f in @_fonts
			if f.name == name
				return
		@_fonts.push({name: name, src: src, weight: weight, style: style})
		@_dirty('_addFonts')
	addFonts:(arr)->
		for item in arr
			@addFont(item.name, item.src, item.weight, item.style)

	_editorUpdateSelection:(e, data)=>
		@_pluginController.update(data)
	_toolbarItemChange:(e, target)=>
		command = target.data.command
		if command
			@_editor.execCommand(command, null, target.selected)
		@_editor.update()

window.slikland.Erlik = slikland.Erlik
