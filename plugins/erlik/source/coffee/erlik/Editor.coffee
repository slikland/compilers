#namespace slikland.erlik
class Editor extends BaseDOM
	@CLASS_NAME: 'erlik_editor'
	@UPDATE_SELECTION: 'erlik_editor_updateSelection'
	@DOM_CHANGED: 'erlik_editor_domChanged'

	constructor:()->
		super({element: 'div', className: @constructor.CLASS_NAME})
		@_element.contentEditable = true
		@_element.on('keydown', @_keyDown)
		@_element.on('keyup', @update)
		@_element.on('mouseup', @update)
		@_element.on('paste', @_onPaste)
	@get value:()->
		return @html
	@set value:(value)->
		@html = value
		@_domChanged()
	update:()=>
		clearTimeout(@_updateTimeout)
		@_updateTimeout = setTimeout(@_update, 0)

	_findSelectionParents:(node)->
		parents = []
		while node
			if node.nodeType == Node.ELEMENT_NODE
				parents.push(node)
				if node.matches('.' + @constructor.CLASS_NAME)
					break
			node = node.parentNode
		return parents
	_update:()=>
		parents = @_findSelectionParents(window.getSelection().anchorNode)
		styles = []
		for p in parents
			styles.push(window.getComputedStyle(p))
		@trigger(@constructor.UPDATE_SELECTION, {styles: styles, parents: parents})

	_domChanged:()=>
		@stackTrigger(@constructor.DOM_CHANGED)

	_onPaste:(e)=>
		data = e.clipboardData || window.clipboardData
		@_domChanged()

	focus:()->
		@_element.focus()
	blur:()->
		selection = @getSelection()
		if selection
			selection.removeAllRanges()
		@_element.blur()
	_isChildOf:(node)->
		while node
			if node == @_element
				return true
			node = node.parentNode
			if node == document.body
				return false
		return false
	getSelection:()->
		selection = window.getSelection()
		if !selection?
			return null
		if !@_isChildOf(document.activeElement)
			return null
		return selection
	getRange:()->
		selection = @getSelection()
		if !selection?
			return null
		if selection.rangeCount < 1
			return null
		return selection.getRangeAt(0)

	execCommand:(command, showDefaultUI = false, args = null)=>
		document.execCommand(command, showDefaultUI, args)

	_keyDown:(e)=>
		prevent = false
		switch e.keyCode
			when 13
				if e.metaKey
					prevent = true
					@_execCommand('insertParagraph')
		if prevent
			e.preventDefault()
			e.stopImmediatePropagation()
		@update()
