class Sub1View extends BaseView

	createStart:(evt=null)=>
		# @a = new BaseDOM({element:"div", className:"blah"})
		# @appendChild(@a)
		
		# @b = new BaseDOM({element:"div", className:"bluh"})
		# @appendChild(@b)
		# color = Math.floor(Math.random()*16777215).toString(16)
		super

	create:(evt=null)=>
		# console.log @id, 'create'
		super

	createComplete:(evt=null)=>
		# console.log @id, 'createComplete'
		super

	showStart:(evt=null)=>
		# console.log @id, 'showStart'
		super

	show:(evt=null)=>
		# console.log @id, 'show'
		super

	showComplete:(evt=null)=>
		# console.log @id, 'showComplete'
		super

	hideStart:(evt=null)=>
		# console.log @id, 'hideStart'
		super

	hide:(evt=null)=>
		# console.log @id, 'hide'
		super

	hideComplete:(evt=null)=>
		# console.log @id, 'hideComplete'
		super

	destroy:(evt=null)=>
		# console.log @id, 'destroy'
		super

	destroyComplete:(evt=null)=>
		# console.log @id, 'destroyComplete'
		super
