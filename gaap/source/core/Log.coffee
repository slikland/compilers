class Log
	@COLORS: {
		'black': 0
		'red': 1
		'green': 2
		'yellow': 3
		'blue': 4
		'magenta': 5
		'cyan': 6
		'white': 7
	}
	@setStyle:(color = 'white', background = null)->
		set = []
		if !@COLORS[color]
			color = 'white'
		set.push('3' + @COLORS[color])
		if background && @COLORS[background]
			set.push('4' + @COLORS[background])
		set.push('22m')
		process.stdout.write('\x1b[' + set.join(';'))
	@log:()->
		console.log(value)
	@print:(value...)->
		process.stdout.write(value.join(' '))
		process.stdout.write('\x1b[0m')
	@println:(value...)->
		process.stdout.write(value.join(' '))
		process.stdout.write('\x1b[0m\n')
	@_test:(data)=>
		process.stdout.off('data', @_test)
		console.log("Received", data)