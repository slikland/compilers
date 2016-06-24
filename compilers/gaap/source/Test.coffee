#import Test2
class Test
	constructor:()->
		new sl.display.BaseDOM()
		a = new slikland.test.Test2()

class Test2
	constructor:()->
		@a = 2

new Test()