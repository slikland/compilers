###*
Bunch of utilities methods for Colors
@class ColorUtils
@static
###
class ColorUtils
	@lightenOrDarken:(p_hex, p_amount)->
		# validate hex string
		color = p_hex.replace(/[^0-9a-f]/gi, '')
		if color.length < 6
			color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2]
		p_amount = p_amount or 0
		# convert to decimal and change amount
		shade = '#'
		c = undefined
		i = undefined
		black = 0
		white = 255
		i = 0
		while i < 3
			c = parseInt(color.substr(i * 2, 2), 16)
			c = Math.round(Math.min(Math.max(black, c + p_amount * white), white)).toString(16)
			shade += ('00' + c).substr(c.length)
			i++
		return shade

	@randomHex:()->
		return '#'+Math.floor(Math.random()*16777215).toString(16)

	@randomRGB:()->
		return ColorUtils.hexToRGB(ColorUtils.randomHex())

	@hexToInt:(p_hex)->
		p_hex = p_hex.substr(4, 2) + p_hex.substr(2, 2) + p_hex.substr(0, 2);
		return parseInt(p_hex, 16)
	
	@RGBToInt:(p_r, p_g, p_b)->
		return ColorUtils.hexToInt(ColorUtils.RGBToHex(p_r, p_g, p_b))

	@RGBToHex:(p_r, p_g, p_b)->
		hex = p_r << 16 | p_g << 8 | p_b
		return "#" + hex.toString(16)

	@hexToRGB:(p_hex) ->
		hex = 0
		if p_hex.charAt(0) == '#'
			if p_hex.length == 4
				p_hex = '#' + p_hex.charAt(1).repeat(2) + p_hex.charAt(2).repeat(2) + p_hex.charAt(3).repeat(2)
			hex = parseInt(p_hex.slice(1), 16)
		r = hex >> 16 & 0xFF
		g = hex >> 8 & 0xFF
		b = hex & 0xFF
		return 'rgb('+r+','+g+','+b+')'
