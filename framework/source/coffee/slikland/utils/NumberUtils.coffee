#import slikland.utils.Prototypes

# Public: Bunch of utilities methods for {Number}
class NumberUtils

	# Public: Checks whether the {Number} is an odd number.
	#
	# value - The {Number} to check.
	#
	# Returns
	#    The resulting {Boolean} object.
	@isOdd:(p_value)->
		return if Math.abs(p_value % 2) == 1 then true else false

	# Public: Checks whether the {Number} is an even number.
	#
	# value - The {Number} to check.
	#
	# Returns
	#    The resulting {Boolean} object.
	@isEven:(p_value)->
		return if p_value%2==0 then true else false

	# Public: Checks whether the {Number} is zero.
	#
	# value - The {Number} to check.
	#
	# Returns
	#    The resulting {Boolean} object.
	@isZero:(p_value)->
		return Math.abs(p_value) < 0.00001

	# Public: Returns the value in percent of a {Number}.
	#
	# value - The {Number} to check.
	# min - The {Number} of lower limit.
	# max - The {Number} of higher limit.
	#
	# Returns
	#    The resulting {Number} object.
	@toPercent:(p_value, p_min, p_max)->
		return ((p_value - p_min) / (p_max - p_min)) * 100

	# Public: Returns the value in Number of a {percent}.
	#
	# percent - The {Number} in percent to check.
	# min - The {Number} of lower limit.
	# max - The {Number} of higher limit.
	#
	# Returns
	#    The resulting {Number} object.
	@percentToValue:(p_percent, p_min, p_max)->
		return ((p_max - p_min) * p_percent) + p_min

	# Public: Returns bytes to formatted MB's string.
	#
	# bytes - {Number} in bytes
	#
	# Returns
	#    {String} in MB's
	@getBytesAsMegabytes:(p_bytes)->
		return (Math.floor(((p_bytes / 1024 / 1024) * 100)) / 100)+" MB"

	# Public: Returns bytes to formatted byte, KB's, MB's or GB's string.
	#
	# bytes - {Number} in bytes
	#
	# Returns
	#    {String} in byte, KB's, MB's or GB's
	@bytesTo:(p_bytes)->
		if      p_bytes >= 1000000000 then return (p_bytes/1000000000).toFixed(2)+' GB'
		else if p_bytes >= 1000000    then return (p_bytes/1000000).toFixed(2)+' MB'
		else if p_bytes >= 1000       then return (p_bytes/1000).toFixed(2)+' KB'
		else if p_bytes > 1           then return p_bytes+' bytes'
		else if p_bytes == 1          then return p_bytes+' byte'
		else                          return '0 byte'

	# Public: Generates a random number between two numbers.
	#
	# low - The {Number} of lower limit.
	# high - The {Number} of higher limit.
	# rounded - the {Boolean} that defines if the random number will be rounded or not.
	#
	# Returns
	#    The resulting {Number} object.
	@rangeRandom:(p_low, p_high, p_rounded=false)->
		return if !p_rounded then (Math.random() * (p_high - p_low)) + p_low else Math.round(Math.round(Math.random() * (p_high - p_low)) + p_low)

