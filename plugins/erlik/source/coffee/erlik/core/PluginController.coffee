#import slikland.event.EventDispatcher
#import slikland.display.BaseDOM
#namespace slikland.erlik.core

class PluginController extends EventDispatcher

	@_init:()->
		if @_inited
			return
		@_inited = true
		@_plugins = {}
		@_mapPlugins()
	@_mapPlugins:(target = null)->
		if !target
			target = slikland.erlik.plugins
		for k, v of target
			if v._IS_ERLIK_PLUGIN?
				if v == slikland.erlik.plugins.Plugin
					continue
				v.NAME = k.toLowerCase()
				@_plugins[v.NAME] = v
			else
				@_mapPlugins(v)

	constructor:(root, editor, toolbar, config)->
		if !(editor instanceof slikland.erlik.Editor)
			throw new Error('Editor is not an slikland.erlik.Editor')
		if !(toolbar instanceof slikland.erlik.Toolbar)
			throw new Error('Toolbar is not an slikland.erlik.Toolbar')
		@constructor._init()
		@_root = root
		@_editor = editor
		@_toolbar = toolbar

		@_plugins = []
		@_setup(config)

		@_processPre = []
		@_processNormal = []
		@_processPos = []

		@_sortPlugins()


	@get config:()->
		return @_config

	_sortPlugins:()->
		@_plugins.sort(@_sortPluginProcessOrder)
		pre = slikland.erlik.plugins.Plugin.PROCESS_PRE
		normal = slikland.erlik.plugins.Plugin.PROCESS_NORMAL
		pos = slikland.erlik.plugins.Plugin.PROCESS_POS
		for p in @_plugins
			if p.constructor.PROCESS_ORDER <= pre
				@_processPre.push(p)
			else if p.constructor.PROCESS_ORDER < pos
				@_processNormal.push(p)
			else
				@_processPos.push(p)

	_sortPluginProcessOrder:(a, b)->
		apo = a.constructor.PROCESS_ORDER
		bpo = b.constructor.PROCESS_ORDER
		if apo < bpo
			return -1
		if apo > bpo
			return 1
		return 0


	_getPlugin:(name)=>
		name = name.toLowerCase()
		for p in @_plugins
			if p.name == name
				return p
		p = @constructor._plugins[name]
		if !p
			return null
		p = new p(@, @_editor)
		p.on(p.constructor.CHANGE, @_pluginChange)
		@_plugins.push(p)
		return p

	_setup:(data)->
		@_config = data
		@_setupToolbar(data.toolbar || slikland.erlik.Toolbar.DEFAULT_ICONS)
		if data.plugins
			@_setupPlugins(data.plugins)

	_setupToolbar:(items)->
		items = @_parseToolbarItems(items)
		@_toolbar.buildItems(items)
	_parseToolbarItems:(items)->
		newItems = []
		for item in items
			if Array.isArray(item)
				newItems.push(@_parseToolbarItems(item))
			else
				newItems.push(@_getPlugin(item))
		return newItems
	_setupPlugins:(items)->
		for name, item of items
			if inst = @_getPlugin(name, false)
				console.log(inst)
				inst.setup?(item)

	_pluginChange:(e, data)=>
		@_editor.focus()
		range = @_editor.getRange()
		plugin = data.plugin
		if !range
			return
		if plugin.command?
			switch plugin.command
				when 'insertElement'
					element = data.element
					if element
						element.editor = @_editor
						element.on('focus', @_pluginFocus)
						range.deleteContents()
						range.insertNode(element.element)
				when 'wrapElement'
					if plugin.selectedTag
						@_removeTag(range, plugin.selectedTag)
					else
						@_wrapRange(range, plugin._tag)
				when 'multiple'
					if plugin.selectedTag
						@_removeTag(range, plugin.selectedTag)
					if data.tag
						console.log(data.tag)
						if data.tag && data.tag.length > 0
							@_wrapRange(range, data.tag)
				else
					@_editor.execCommand(plugin.command, null, plugin.value)
		@_editor.update()
	_wrapRange:(range, tagData)->

		tagParts = /^([^\#\.\s]*?)([\#\.].*?)?$/.exec(tagData)
		console.log(tagParts, tagData)
		if !tagParts
			return
		tagName = tagParts[1] || 'div'

		tag = document.createElement(tagName)
		if tagParts[2]
			partRE = /([\#\.])([^\#\.\s]+|$)/g
			while o = partRE.exec(tagParts[2])
				console.log(o)
				if o[1] == '#'
					id = tag.id || ''
					id = id.split(' ')
					id.push(o[2])
					tag.id = id.join(' ')
				else
					className = tag.className || ''
					className = className.split(' ')
					className.push(o[2])
					tag.className = className.join(' ')


		range.surroundContents(tag)

	_removeTag:(range, tag)->
		nodes = tag.childNodes
		newNodes = []
		i = nodes.length
		while i-- > 0
			newNodes[i] = nodes[i].cloneNode(true)
		range.selectNode(tag)
		range.deleteContents()
		i = newNodes.length
		while i-- > 0
			range.insertNode(newNodes[i])
	_pluginFocus:(e)=>
		@_editor.blur()

	update:(data)->
		for p in @_plugins
			p.update(data.styles, data.parents)
	parseDOM:(nodeList)->
		i = @_plugins.length
		while i-- > 0
			plugin = @_plugins[i]
			plugin.parseElement?(nodeList)

