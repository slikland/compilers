#import slikland.utils.Prototypes
 
class URLUtils

	@compare:(a, b, base = app?.root || '')->
		base = base.replace(/^\/|\/$|https?:\/\//gi, '')
		regBase = new RegExp(base + '\/?')
		a = a.replace(regBase, '').replace(/https?:\/+|\([^)]*\)\?|^\/+|\/+$/gi, '')
		b = b.replace(regBase, '').replace(/https?:\/+|\([^)]*\)\?|^\/+|\/+$/gi, '')
		return a == b

	@sameHost:(a, b)->
		a = a.replace(/https?:\/\//gi, '')
		b = b.replace(/https?:\/\//gi, '')
		return b.indexOf(a) > -1 || a.indexOf(b) > -1

	@removeQueryParameter:(url, parameter)->
		#prefer to use l.search if you have a location/link object
		urlparts = url.split('?')
		if urlparts.length >= 2
			prefix = encodeURIComponent(parameter) + '='
			pars = urlparts[1].split(/[&;]/g)
			#reverse iteration as may be destructive
			i = pars.length
			while i-- > 0
				#idiom for string.startsWith
				if pars[i].lastIndexOf(prefix, 0) != -1
					pars.splice i, 1
			url = urlparts[0] + (if pars.length > 0 then '?' + pars.join('&') else '')
			url
		else
			url

	@parseParams:(p_path = '')->
		return null if typeof p_path isnt 'string'
		params = {}
		if p_path
			pRE = /&?([^=&]+)=?([^=&]*)/g
			c = 0
			while o = pRE.exec(p_path)
				params[o[1]] = o[2]
		return params

	@parseSerialize:(obj, prefix)->
		str = []
		for p of obj
			if obj.hasOwnProperty(p)
				k = if prefix then prefix + '[' + p + ']' else p
				v = obj[p]
				str.push if v != null and typeof v is 'object' then serialize(v, k) else encodeURIComponent(k) + '=' + encodeURIComponent(v)
		str.join '&'
	