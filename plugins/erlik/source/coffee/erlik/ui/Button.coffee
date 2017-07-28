#namespace slikland.erlik.ui
class Button extends BaseDOM
	@CLICK: 'click'
	constructor:(data)->
		@_toggle = false
		super({element: 'button', className: 'erlik_button'})
		if data.icon?
			@_icon = new BaseDOM({element: 'i', className: 'fa ' + data.icon})
			@appendChild(@_icon)
		if data.label?
			@_label = new BaseDOM({element: 'span', className: 'label'})
			@_label.html = data.label
			@appendChild(@_label)
		@_data = data
		@toggle = data.toggle || false
		if @_data.tooltip?
			@attr('tooltip', @_data.tooltip)
		@element.on('click', @_click)

	_click:(e)=>
		e.preventDefault()
		@selected = !@selected
		@trigger(@constructor.CLICK)

	@get data:()->
		return @_data

	@get toggle:()->
		return @_toggle
	@set toggle:(value)->
		if @_toggle == value
			return
		@_toggle = value
		if !@_toggle
			@selected = false
	@get selected:()->
		return @_selected
	@set selected:(value)->
		if !@_toggle
			return
		if @_selected == value
			return
		@_selected = value
		@toggleClass('selected', @_selected && @_toggle)

	@get value:()->
		return @selected
	@set value:(value)->
		@selected = value

	@set _dirty:(value)->
		if !value
			return
		clearTimeout(@_dirtyCallback)
		@_dirtyCallback = setTimeout(@_redraw, 0)

	_redraw:()=>
