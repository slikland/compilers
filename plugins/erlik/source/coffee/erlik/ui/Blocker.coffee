#namespace slikland.erlik.ui
#import slikland.display.BaseDOM
class Blocker extends BaseDOM
	@CLOSE: 'close'

	@_instances = []
	@open:(content = null)->
		instance = new Blocker(content)
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

	constructor:()->
		super({element: 'div', className: 'erlik_blocker'})
		@constructor._registerInstance(@)

		@_container = new BaseDOM({className: 'erlik_blocker_container'})
		@appendChild(@_container)

	open:()=>
		document.body.appendChild(@element)

	close:()=>
		@trigger(@constructor.CLOSE)
		@element.parentNode?.removeChild(@element)
		@constructor._unregisterInstance(@)

	destroy:()->
		super
