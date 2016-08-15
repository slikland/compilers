#namespace slikland.erlik.ui
class ProgressBar extends BaseDOM
	constructor:(data)->
		super({element: 'div', className: 'erlik_progressbar'})
		@_progress = Number.POSITIVE_INFINITY

		@_progressBar = new BaseDOM({element: 'div', className: 'progress'})
		@appendChild(@_progressBar)

		@color = 0x9999FF
		@progress = 0.5

	@get progress:()->
		return @_progress

	@set progress:(value)->
		@_progress = value
		p = 1
		if isFinite(@_progress)
			p = @_progress
		if p > 1
			p = 1
		else if p < 0
			p = 0
		@_progressBar.css({
			width: p * 100 + '%'
		})

	@get color:()->
		return @_color
	@set color:(value)->
		if typeof(value) == 'string'
			hexRE = /^#((?:[\da-f]{3}){1,2})/i
			rgbRE = /^rgba?\(([\d]+).*?([\d]+).*?([\d]+).*?\)/i
			if o = hexRE.exec(value)
				c = o[1]
				l = c.length / 3
				c = parseInt(c, 16)
				max = (Math.pow(16, l) - 1)
				r = ((c >> (4 * l * 2) & max) / max) * 0xFF
				g = ((c >> (4 * l * 1) & max) / max) * 0xFF
				b = ((c >> (4 * l * 0) & max) / max) * 0xFF
			else if o = rgbRE.exec(value)
				r = Number(o[1])
				g = Number(o[2])
				b = Number(o[3])
			else
				throw new Error('Not a color value')
		else
			r = value >> 16 & 0xFF
			g = value >> 8 & 0xFF
			b = value >> 0 & 0xFF
		value = r << 16 | g << 8 | b
		bgR = ((0xFF - r) * 0.5 + r) >> 0
		bgG = ((0xFF - g) * 0.5 + g) >> 0
		bgB = ((0xFF - b) * 0.5 + b) >> 0
		@css({
			'background-color': "rgb(#{bgR}, #{bgG}, #{bgB})"
		})
		@_progressBar.css({
			'background-color': "rgb(#{r}, #{g}, #{b})"
		})
		@_color = value