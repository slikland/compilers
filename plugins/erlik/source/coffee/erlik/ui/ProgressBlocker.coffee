#import erlik.ui.Blocker
#namespace slikland.erlik.ui
class ProgressBlocker extends slikland.erlik.ui.Blocker
	constructor:()->
		super

		@_title = new BaseDOM({className: 'title'})
		@_container.appendChild(@_title)

		@_progressBar = new BaseDOM({className: 'title'})
		@_container.appendChild(@_title)

		@_progressBar = new slikland.erlik.ui.ProgressBar()
		@_progressBar.progress = 0
		@_container.appendChild(@_progressBar)

		@_text = new BaseDOM({className: 'text'})
		@_container.appendChild(@_text)

	@get title:()->
		return @_title.html
	@set title:(value)->
		@_title.html = value

	@get progress:()->
		return @_progressBar.progress
	@set progress:(value)->
		@_progressBar.progress = value

	@get text:()->
		return @_text.html
	@set text:(value)->
		@_text.html = value
