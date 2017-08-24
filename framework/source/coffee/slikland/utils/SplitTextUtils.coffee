class SplitTextUtils
	@splitHTMLChars:(target, opt = {}, className = 'split-chunk')->
		return @_splitHTML(target, className, opt, @_replaceChars)

	@splitHTMLWords:(target, opt = {}, className = 'split-chunk')->
		return @_splitHTML(target, className, opt, @_replaceWords)

	@splitHTMLLines:(target, opt = {}, className = 'split-chunk')->
		words = @_splitHTML(target, className, opt, @_replaceWords)
		l = words.length
		i = -1
		lastTop = 0
		lines = []
		line = []
		parents = []
		while ++i < l
			word = words[i]
			word.className = ''
			b = word.getBoundingClientRect()
			if lastTop < b.top
				if line.length > 0
					lines.push(line)
					line = []
				lastTop = b.top
			parent = @_findParentsUntil(word, target)
			if !(parent in parents)
				line.push(parent)
		if line.length > 0
			lines.push(line)
		spans = []
		for line in lines
			span = document.createElement('span')
			span.className = className
			line[0].parentNode.insertBefore(span, line[0])
			for word in line
				span.appendChild(word)
				span.appendChild(document.createTextNode(' '))
			spans.push(span)
		return spans

	@_findParentsUntil:(target, parent)->
		if target.parentNode == parent
			return target
		else if target.parentNode == document.body || !target.parentNode
			return target
		else
			return @_findParentsUntil(target.parentNode, parent)


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
