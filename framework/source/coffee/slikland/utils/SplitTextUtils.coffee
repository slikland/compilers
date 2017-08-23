class SplitTextUtils
	@splitHTMLChars:(target, opt = {}, className = 'split-chunk')->
		return @_splitHTML(target, className, opt, @_replaceChars)

	@splitHTMLWords:(target, opt = {}, className = 'split-chunk')->
		return @_splitHTML(target, className, opt, @_replaceWords)

	@_splitHTML:(target, className, opt, type)->
		if target instanceof BaseDOM
			target = target.element

		html = target.innerHTML
		@_currentClassName = className
		replacedHTML = html.replace(/([^\<\>]*)?(\<[^\>]*\>)?/ig, type)

		target.innerHTML = replacedHTML
		items = target.querySelectorAll('.' + className)
		rItems = []
		i = items.length
		while i-- > 0
			rItems[i] = items[i]
		return rItems

		# return new SplitText(target.querySelectorAll('.' + className), opt)

	@_replaceChars:(match, text, tag)=>
		ret = ''
		if text
			ret = text.replace(/(.)/g, '<span class="'+@_currentClassName+'">$1</span>')
			ret = ret.replace(/(> <)/g, ">&nbsp;<")
			ret = "<div class='split-word'>" + ret
			ret = @_replaceAll(ret,'<span class="' + @_currentClassName + '">&nbsp;</span>', "</div>"+'<span class="' + @_currentClassName + '">&nbsp;</span>'+"<div class='split-word'>")
			ret = ret + "</div>"
		if tag
			ret += tag
		return ret

	@_replaceWords:(match, text, tag)=>
		ret = ''
		if text
			ret = text.replace(/([^\s]+)/g, '<span class="'+@_currentClassName+'">$1</span>')
		if tag
			ret += tag
		return ret

	@_replaceAll:(target, search, replacement)=>
		return target.replace(new RegExp(search, 'g'), replacement)
