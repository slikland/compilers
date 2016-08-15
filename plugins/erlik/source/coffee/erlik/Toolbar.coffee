#namespace slikland.erlik
class Toolbar extends BaseDOM

	@DEFAULT_ICONS: [
		['bold', 'italic', 'underline', 'strikethrough', 'color']
		['left', 'center', 'right', 'justify']
		['indent', 'outdent', 'orderedlist', 'unorderedlist']
		['media', 'gallery']
	]

	constructor:()->
		@_items = []
		super({element: 'div', className: 'erlik_toolbar'})
	getState:(data)->

	setState:(data)->

	buildItems:(items, container = @)->
		for item in items
			if Array.isArray(item)
				iconContainer = new BaseDOM({element: 'span', className: 'icon-container'})
				@buildItems(item, iconContainer)
				container.appendChild(iconContainer)
			else
				if item?.toolbarUI
					icon = item.toolbarUI
					container.appendChild(icon)
					@_items.push(icon)

	_triggerChange:()->
		clearTimeout(@_changeTimeout)
		@_changeTimeout = setTimeout(@_change, 0)

	_change:()=>
		@trigger(@constructor.CHANGE)

	_iconClick:(e)=>
		@trigger(@constructor.ITEM_CHANGE, e.currentTarget)
		@_triggerChange()

	_itemValidation_b:(value, key)->
		if value > 500 || value == 'bold'
			return true
		return false
	_itemValidation_i:(value, key)->
		if value == 'italic'
			return true
		return false
	_itemValidation_u:(value, key)->
		if value == 'underline'
			return true
		return false
	_itemValidation_s:(value, key)->
		if value == 'line-through'
			return true
		return false
	_itemValidation_left:(value, key)->
		if value == 'left'
			return true
		return false
	_itemValidation_right:(value, key)->
		if value == 'right'
			return true
		return false
	_itemValidation_center:(value, key)->
		if value == 'center'
			return true
		return false
	_itemValidation_justify:(value, key)->
		if value == 'justify'
			return true
		return false
