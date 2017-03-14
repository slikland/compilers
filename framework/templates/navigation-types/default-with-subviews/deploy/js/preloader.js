(function() {
var __bind=function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
__hasProp={}.hasOwnProperty,
__indexOf=[].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
__extends=function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) Object.defineProperty(child, key, Object.getOwnPropertyDescriptor(parent, key)); } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
/**
It's a simple wrapper to PreloadJS.
See more info on <a href="http://www.createjs.com/docs/preloadjs/" target="_blank" class="crosslink">PreloadJS Docs</a>
@class PreloadFiles
 */
this.createjs=this.createjs||{},function(){"use strict";var a=createjs.PreloadJS=createjs.PreloadJS||{};a.version="0.6.2",a.buildDate="Thu, 26 Nov 2015 20:44:31 GMT"}(),this.createjs=this.createjs||{},createjs.extend=function(a,b){"use strict";function c(){this.constructor=a}return c.prototype=b.prototype,a.prototype=new c},this.createjs=this.createjs||{},createjs.promote=function(a,b){"use strict";var c=a.prototype,d=Object.getPrototypeOf&&Object.getPrototypeOf(c)||c.__proto__;if(d){c[(b+="_")+"constructor"]=d.constructor;for(var e in d)c.hasOwnProperty(e)&&"function"==typeof d[e]&&(c[b+e]=d[e])}return a},this.createjs=this.createjs||{},function(){"use strict";createjs.proxy=function(a,b){var c=Array.prototype.slice.call(arguments,2);return function(){return a.apply(b,Array.prototype.slice.call(arguments,0).concat(c))}}}(),this.createjs=this.createjs||{},createjs.indexOf=function(a,b){"use strict";for(var c=0,d=a.length;c<d;c++)if(b===a[c])return c;return-1},this.createjs=this.createjs||{},function(){"use strict";function a(a,b,c){this.type=a,this.target=null,this.currentTarget=null,this.eventPhase=0,this.bubbles=!!b,this.cancelable=!!c,this.timeStamp=(new Date).getTime(),this.defaultPrevented=!1,this.propagationStopped=!1,this.immediatePropagationStopped=!1,this.removed=!1}var b=a.prototype;b.preventDefault=function(){this.defaultPrevented=this.cancelable&&!0},b.stopPropagation=function(){this.propagationStopped=!0},b.stopImmediatePropagation=function(){this.immediatePropagationStopped=this.propagationStopped=!0},b.remove=function(){this.removed=!0},b.clone=function(){return new a(this.type,this.bubbles,this.cancelable)},b.set=function(a){for(var b in a)this[b]=a[b];return this},b.toString=function(){return"[Event (type="+this.type+")]"},createjs.Event=a}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b,c){this.Event_constructor("error"),this.title=a,this.message=b,this.data=c}var b=createjs.extend(a,createjs.Event);b.clone=function(){return new createjs.ErrorEvent(this.title,this.message,this.data)},createjs.ErrorEvent=createjs.promote(a,"Event")}(),this.createjs=this.createjs||{},function(){"use strict";function a(){this._listeners=null,this._captureListeners=null}var b=a.prototype;a.initialize=function(a){a.addEventListener=b.addEventListener,a.on=b.on,a.removeEventListener=a.off=b.removeEventListener,a.removeAllEventListeners=b.removeAllEventListeners,a.hasEventListener=b.hasEventListener,a.dispatchEvent=b.dispatchEvent,a._dispatchEvent=b._dispatchEvent,a.willTrigger=b.willTrigger},b.addEventListener=function(a,b,c){var d;d=c?this._captureListeners=this._captureListeners||{}:this._listeners=this._listeners||{};var e=d[a];return e&&this.removeEventListener(a,b,c),e=d[a],e?e.push(b):d[a]=[b],b},b.on=function(a,b,c,d,e,f){return b.handleEvent&&(c=c||b,b=b.handleEvent),c=c||this,this.addEventListener(a,function(a){b.call(c,a,e),d&&a.remove()},f)},b.removeEventListener=function(a,b,c){var d=c?this._captureListeners:this._listeners;if(d){var e=d[a];if(e)for(var f=0,g=e.length;f<g;f++)if(e[f]==b){1==g?delete d[a]:e.splice(f,1);break}}},b.off=b.removeEventListener,b.removeAllEventListeners=function(a){a?(this._listeners&&delete this._listeners[a],this._captureListeners&&delete this._captureListeners[a]):this._listeners=this._captureListeners=null},b.dispatchEvent=function(a,b,c){if("string"==typeof a){var d=this._listeners;if(!(b||d&&d[a]))return!0;a=new createjs.Event(a,b,c)}else a.target&&a.clone&&(a=a.clone());try{a.target=this}catch(a){}if(a.bubbles&&this.parent){for(var e=this,f=[e];e.parent;)f.push(e=e.parent);var g,h=f.length;for(g=h-1;g>=0&&!a.propagationStopped;g--)f[g]._dispatchEvent(a,1+(0==g));for(g=1;g<h&&!a.propagationStopped;g++)f[g]._dispatchEvent(a,3)}else this._dispatchEvent(a,2);return!a.defaultPrevented},b.hasEventListener=function(a){var b=this._listeners,c=this._captureListeners;return!!(b&&b[a]||c&&c[a])},b.willTrigger=function(a){for(var b=this;b;){if(b.hasEventListener(a))return!0;b=b.parent}return!1},b.toString=function(){return"[EventDispatcher]"},b._dispatchEvent=function(a,b){var c,d=1==b?this._captureListeners:this._listeners;if(a&&d){var e=d[a.type];if(!e||!(c=e.length))return;try{a.currentTarget=this}catch(a){}try{a.eventPhase=b}catch(a){}a.removed=!1,e=e.slice();for(var f=0;f<c&&!a.immediatePropagationStopped;f++){var g=e[f];g.handleEvent?g.handleEvent(a):g(a),a.removed&&(this.off(a.type,g,1==b),a.removed=!1)}}},createjs.EventDispatcher=a}(),this.createjs=this.createjs||{},function(a){"use strict";function b(a,b){this.Event_constructor("progress"),this.loaded=a,this.total=null==b?1:b,this.progress=0==b?0:this.loaded/this.total}var c=createjs.extend(b,createjs.Event);c.clone=function(){return new createjs.ProgressEvent(this.loaded,this.total)},createjs.ProgressEvent=createjs.promote(b,"Event")}(window),function(){function f(a,c){function t(a){if(t[a]!==r)return t[a];var b;if("bug-string-char-index"==a)b="a"!="a"[0];else if("json"==a)b=t("json-stringify")&&t("json-parse");else{var d,f='{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';if("json-stringify"==a){var h=c.stringify,j="function"==typeof h&&s;if(j){(d=function(){return 1}).toJSON=d;try{j="0"===h(0)&&"0"===h(new e)&&'""'==h(new g)&&h(o)===r&&h(r)===r&&h()===r&&"1"===h(d)&&"[1]"==h([d])&&"[null]"==h([r])&&"null"==h(null)&&"[null,null,null]"==h([r,o,null])&&h({a:[d,!0,!1,null,"\0\b\n\f\r\t"]})==f&&"1"===h(null,d)&&"[\n 1,\n 2\n]"==h([1,2],null,1)&&'"-271821-04-20T00:00:00.000Z"'==h(new i(-864e13))&&'"+275760-09-13T00:00:00.000Z"'==h(new i(864e13))&&'"-000001-01-01T00:00:00.000Z"'==h(new i(-621987552e5))&&'"1969-12-31T23:59:59.999Z"'==h(new i(-1))}catch(a){j=!1}}b=j}if("json-parse"==a){var k=c.parse;if("function"==typeof k)try{if(0===k("0")&&!k(!1)){d=k(f);var l=5==d.a.length&&1===d.a[0];if(l){try{l=!k('"\t"')}catch(a){}if(l)try{l=1!==k("01")}catch(a){}if(l)try{l=1!==k("1.")}catch(a){}}}}catch(a){l=!1}b=l}}return t[a]=!!b}a||(a=d.Object()),c||(c=d.Object());var e=a.Number||d.Number,g=a.String||d.String,h=a.Object||d.Object,i=a.Date||d.Date,j=a.SyntaxError||d.SyntaxError,k=a.TypeError||d.TypeError,l=a.Math||d.Math,m=a.JSON||d.JSON;"object"==typeof m&&m&&(c.stringify=m.stringify,c.parse=m.parse);var p,q,r,n=h.prototype,o=n.toString,s=new i(-0xc782b5b800cec);try{s=s.getUTCFullYear()==-109252&&0===s.getUTCMonth()&&1===s.getUTCDate()&&10==s.getUTCHours()&&37==s.getUTCMinutes()&&6==s.getUTCSeconds()&&708==s.getUTCMilliseconds()}catch(a){}if(!t("json")){var u="[object Function]",v="[object Date]",w="[object Number]",x="[object String]",y="[object Array]",z="[object Boolean]",A=t("bug-string-char-index");if(!s)var B=l.floor,C=[0,31,59,90,120,151,181,212,243,273,304,334],D=function(a,b){return C[b]+365*(a-1970)+B((a-1969+(b=+(b>1)))/4)-B((a-1901+b)/100)+B((a-1601+b)/400)};if((p=n.hasOwnProperty)||(p=function(a){var c,b={};return(b.__proto__=null,b.__proto__={toString:1},b).toString!=o?p=function(a){var b=this.__proto__,c=a in(this.__proto__=null,this);return this.__proto__=b,c}:(c=b.constructor,p=function(a){var b=(this.constructor||c).prototype;return a in this&&!(a in b&&this[a]===b[a])}),b=null,p.call(this,a)}),q=function(a,c){var e,f,g,d=0;(e=function(){this.valueOf=0}).prototype.valueOf=0,f=new e;for(g in f)p.call(f,g)&&d++;return e=f=null,d?q=2==d?function(a,b){var e,c={},d=o.call(a)==u;for(e in a)d&&"prototype"==e||p.call(c,e)||!(c[e]=1)||!p.call(a,e)||b(e)}:function(a,b){var d,e,c=o.call(a)==u;for(d in a)c&&"prototype"==d||!p.call(a,d)||(e="constructor"===d)||b(d);(e||p.call(a,d="constructor"))&&b(d)}:(f=["valueOf","toString","toLocaleString","propertyIsEnumerable","isPrototypeOf","hasOwnProperty","constructor"],q=function(a,c){var e,g,d=o.call(a)==u,h=!d&&"function"!=typeof a.constructor&&b[typeof a.hasOwnProperty]&&a.hasOwnProperty||p;for(e in a)d&&"prototype"==e||!h.call(a,e)||c(e);for(g=f.length;e=f[--g];h.call(a,e)&&c(e));}),q(a,c)},!t("json-stringify")){var E={92:"\\\\",34:'\\"',8:"\\b",12:"\\f",10:"\\n",13:"\\r",9:"\\t"},F="000000",G=function(a,b){return(F+(b||0)).slice(-a)},H="\\u00",I=function(a){for(var b='"',c=0,d=a.length,e=!A||d>10,f=e&&(A?a.split(""):a);c<d;c++){var g=a.charCodeAt(c);switch(g){case 8:case 9:case 10:case 12:case 13:case 34:case 92:b+=E[g];break;default:if(g<32){b+=H+G(2,g.toString(16));break}b+=e?f[c]:a.charAt(c)}}return b+'"'},J=function(a,b,c,d,e,f,g){var h,i,j,l,m,n,s,t,u,A,C,E,F,H,K,L;try{h=b[a]}catch(a){}if("object"==typeof h&&h)if(i=o.call(h),i!=v||p.call(h,"toJSON"))"function"==typeof h.toJSON&&(i!=w&&i!=x&&i!=y||p.call(h,"toJSON"))&&(h=h.toJSON(a));else if(h>-1/0&&h<1/0){if(D){for(m=B(h/864e5),j=B(m/365.2425)+1970-1;D(j+1,0)<=m;j++);for(l=B((m-D(j,0))/30.42);D(j,l+1)<=m;l++);m=1+m-D(j,l),n=(h%864e5+864e5)%864e5,s=B(n/36e5)%24,t=B(n/6e4)%60,u=B(n/1e3)%60,A=n%1e3}else j=h.getUTCFullYear(),l=h.getUTCMonth(),m=h.getUTCDate(),s=h.getUTCHours(),t=h.getUTCMinutes(),u=h.getUTCSeconds(),A=h.getUTCMilliseconds();h=(j<=0||j>=1e4?(j<0?"-":"+")+G(6,j<0?-j:j):G(4,j))+"-"+G(2,l+1)+"-"+G(2,m)+"T"+G(2,s)+":"+G(2,t)+":"+G(2,u)+"."+G(3,A)+"Z"}else h=null;if(c&&(h=c.call(b,a,h)),null===h)return"null";if(i=o.call(h),i==z)return""+h;if(i==w)return h>-1/0&&h<1/0?""+h:"null";if(i==x)return I(""+h);if("object"==typeof h){for(H=g.length;H--;)if(g[H]===h)throw k();if(g.push(h),C=[],K=f,f+=e,i==y){for(F=0,H=h.length;F<H;F++)E=J(F,h,c,d,e,f,g),C.push(E===r?"null":E);L=C.length?e?"[\n"+f+C.join(",\n"+f)+"\n"+K+"]":"["+C.join(",")+"]":"[]"}else q(d||h,function(a){var b=J(a,h,c,d,e,f,g);b!==r&&C.push(I(a)+":"+(e?" ":"")+b)}),L=C.length?e?"{\n"+f+C.join(",\n"+f)+"\n"+K+"}":"{"+C.join(",")+"}":"{}";return g.pop(),L}};c.stringify=function(a,c,d){var e,f,g,h;if(b[typeof c]&&c)if((h=o.call(c))==u)f=c;else if(h==y){g={};for(var k,i=0,j=c.length;i<j;k=c[i++],h=o.call(k),(h==x||h==w)&&(g[k]=1));}if(d)if((h=o.call(d))==w){if((d-=d%1)>0)for(e="",d>10&&(d=10);e.length<d;e+=" ");}else h==x&&(e=d.length<=10?d:d.slice(0,10));return J("",(k={},k[""]=a,k),f,g,e,"",[])}}if(!t("json-parse")){var M,N,K=g.fromCharCode,L={92:"\\",34:'"',47:"/",98:"\b",116:"\t",110:"\n",102:"\f",114:"\r"},O=function(){throw M=N=null,j()},P=function(){for(var c,d,e,f,g,a=N,b=a.length;M<b;)switch(g=a.charCodeAt(M)){case 9:case 10:case 13:case 32:M++;break;case 123:case 125:case 91:case 93:case 58:case 44:return c=A?a.charAt(M):a[M],M++,c;case 34:for(c="@",M++;M<b;)if(g=a.charCodeAt(M),g<32)O();else if(92==g)switch(g=a.charCodeAt(++M)){case 92:case 34:case 47:case 98:case 116:case 110:case 102:case 114:c+=L[g],M++;break;case 117:for(d=++M,e=M+4;M<e;M++)g=a.charCodeAt(M),g>=48&&g<=57||g>=97&&g<=102||g>=65&&g<=70||O();c+=K("0x"+a.slice(d,M));break;default:O()}else{if(34==g)break;for(g=a.charCodeAt(M),d=M;g>=32&&92!=g&&34!=g;)g=a.charCodeAt(++M);c+=a.slice(d,M)}if(34==a.charCodeAt(M))return M++,c;O();default:if(d=M,45==g&&(f=!0,g=a.charCodeAt(++M)),g>=48&&g<=57){for(48==g&&(g=a.charCodeAt(M+1),g>=48&&g<=57)&&O(),f=!1;M<b&&(g=a.charCodeAt(M),g>=48&&g<=57);M++);if(46==a.charCodeAt(M)){for(e=++M;e<b&&(g=a.charCodeAt(e),g>=48&&g<=57);e++);e==M&&O(),M=e}if(g=a.charCodeAt(M),101==g||69==g){for(g=a.charCodeAt(++M),43!=g&&45!=g||M++,e=M;e<b&&(g=a.charCodeAt(e),g>=48&&g<=57);e++);e==M&&O(),M=e}return+a.slice(d,M)}if(f&&O(),"true"==a.slice(M,M+4))return M+=4,!0;if("false"==a.slice(M,M+5))return M+=5,!1;if("null"==a.slice(M,M+4))return M+=4,null;O()}return"$"},Q=function(a){var b,c;if("$"==a&&O(),"string"==typeof a){if("@"==(A?a.charAt(0):a[0]))return a.slice(1);if("["==a){for(b=[];a=P(),"]"!=a;c||(c=!0))c&&(","==a?(a=P(),"]"==a&&O()):O()),","==a&&O(),b.push(Q(a));return b}if("{"==a){for(b={};a=P(),"}"!=a;c||(c=!0))c&&(","==a?(a=P(),"}"==a&&O()):O()),","!=a&&"string"==typeof a&&"@"==(A?a.charAt(0):a[0])&&":"==P()||O(),b[a.slice(1)]=Q(P());return b}O()}return a},R=function(a,b,c){var d=S(a,b,c);d===r?delete a[b]:a[b]=d},S=function(a,b,c){var e,d=a[b];if("object"==typeof d&&d)if(o.call(d)==y)for(e=d.length;e--;)R(d,e,c);else q(d,function(a){R(d,a,c)});return c.call(a,b,d)};c.parse=function(a,b){var c,d;return M=0,N=""+a,c=Q(P()),"$"!=P()&&O(),M=N=null,b&&o.call(b)==u?S((d={},d[""]=c,d),"",b):c}}}return c.runInContext=f,c}var a="function"==typeof define&&define.amd,b={function:!0,object:!0},c=b[typeof exports]&&exports&&!exports.nodeType&&exports,d=b[typeof window]&&window||this,e=c&&b[typeof module]&&module&&!module.nodeType&&"object"==typeof global&&global;if(!e||e.global!==e&&e.window!==e&&e.self!==e||(d=e),c&&!a)f(d,c);else{var g=d.JSON,h=d.JSON3,i=!1,j=f(d,d.JSON3={noConflict:function(){return i||(i=!0,d.JSON=g,d.JSON3=h,g=h=null),j}});d.JSON={parse:j.parse,stringify:j.stringify}}a&&define(function(){return j})}.call(this),function(){var a={};a.appendToHead=function(b){a.getHead().appendChild(b)},a.getHead=function(){return document.head||document.getElementsByTagName("head")[0]},a.getBody=function(){return document.body||document.getElementsByTagName("body")[0]},createjs.DomUtils=a}(),function(){var a={};a.parseXML=function(a,b){var c=null;try{if(window.DOMParser){var d=new DOMParser;c=d.parseFromString(a,b)}}catch(a){}if(!c)try{c=new ActiveXObject("Microsoft.XMLDOM"),c.async=!1,c.loadXML(a)}catch(a){c=null}return c},a.parseJSON=function(a){if(null==a)return null;try{return JSON.parse(a)}catch(a){throw a}},createjs.DataUtils=a}(),this.createjs=this.createjs||{},function(){"use strict";function a(){this.src=null,this.type=null,this.id=null,this.maintainOrder=!1,this.callback=null,this.data=null,this.method=createjs.LoadItem.GET,this.values=null,this.headers=null,this.withCredentials=!1,this.mimeType=null,this.crossOrigin=null,this.loadTimeout=c.LOAD_TIMEOUT_DEFAULT}var b=a.prototype={},c=a;c.LOAD_TIMEOUT_DEFAULT=8e3,c.create=function(b){if("string"==typeof b){var d=new a;return d.src=b,d}if(b instanceof c)return b;if(b instanceof Object&&b.src)return null==b.loadTimeout&&(b.loadTimeout=c.LOAD_TIMEOUT_DEFAULT),b;throw new Error("Type not recognized.")},b.set=function(a){for(var b in a)this[b]=a[b];return this},createjs.LoadItem=c}(),function(){var a={};a.ABSOLUTE_PATT=/^(?:\w+:)?\/{2}/i,a.RELATIVE_PATT=/^[.\/]*?\//i,a.EXTENSION_PATT=/\/?[^\/]+\.(\w{1,5})$/i,a.parseURI=function(b){var c={absolute:!1,relative:!1};if(null==b)return c;var d=b.indexOf("?");d>-1&&(b=b.substr(0,d));var e;return a.ABSOLUTE_PATT.test(b)?c.absolute=!0:a.RELATIVE_PATT.test(b)&&(c.relative=!0),(e=b.match(a.EXTENSION_PATT))&&(c.extension=e[1].toLowerCase()),c},a.formatQueryString=function(a,b){if(null==a)throw new Error("You must specify data.");var c=[];for(var d in a)c.push(d+"="+escape(a[d]));return b&&(c=c.concat(b)),c.join("&")},a.buildPath=function(a,b){if(null==b)return a;var c=[],d=a.indexOf("?");if(d!=-1){var e=a.slice(d+1);c=c.concat(e.split("&"))}return d!=-1?a.slice(0,d)+"?"+this.formatQueryString(b,c):a+"?"+this.formatQueryString(b,c)},a.isCrossDomain=function(a){var b=document.createElement("a");b.href=a.src;var c=document.createElement("a");c.href=location.href;var d=""!=b.hostname&&(b.port!=c.port||b.protocol!=c.protocol||b.hostname!=c.hostname);return d},a.isLocal=function(a){var b=document.createElement("a");return b.href=a.src,""==b.hostname&&"file:"==b.protocol},a.isBinary=function(a){switch(a){case createjs.AbstractLoader.IMAGE:case createjs.AbstractLoader.BINARY:return!0;default:return!1}},a.isImageTag=function(a){return a instanceof HTMLImageElement},a.isAudioTag=function(a){return!!window.HTMLAudioElement&&a instanceof HTMLAudioElement},a.isVideoTag=function(a){return!!window.HTMLVideoElement&&a instanceof HTMLVideoElement},a.isText=function(a){switch(a){case createjs.AbstractLoader.TEXT:case createjs.AbstractLoader.JSON:case createjs.AbstractLoader.MANIFEST:case createjs.AbstractLoader.XML:case createjs.AbstractLoader.CSS:case createjs.AbstractLoader.SVG:case createjs.AbstractLoader.JAVASCRIPT:case createjs.AbstractLoader.SPRITESHEET:return!0;default:return!1}},a.getTypeByExtension=function(a){if(null==a)return createjs.AbstractLoader.TEXT;switch(a.toLowerCase()){case"jpeg":case"jpg":case"gif":case"png":case"webp":case"bmp":return createjs.AbstractLoader.IMAGE;case"ogg":case"mp3":case"webm":return createjs.AbstractLoader.SOUND;case"mp4":case"webm":case"ts":return createjs.AbstractLoader.VIDEO;case"json":return createjs.AbstractLoader.JSON;case"xml":return createjs.AbstractLoader.XML;case"css":return createjs.AbstractLoader.CSS;case"js":return createjs.AbstractLoader.JAVASCRIPT;case"svg":return createjs.AbstractLoader.SVG;default:return createjs.AbstractLoader.TEXT}},createjs.RequestUtils=a}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b,c){this.EventDispatcher_constructor(),this.loaded=!1,this.canceled=!1,this.progress=0,this.type=c,this.resultFormatter=null,a?this._item=createjs.LoadItem.create(a):this._item=null,this._preferXHR=b,this._result=null,this._rawResult=null,this._loadedItems=null,this._tagSrcAttribute=null,this._tag=null}var b=createjs.extend(a,createjs.EventDispatcher),c=a;c.POST="POST",c.GET="GET",c.BINARY="binary",c.CSS="css",c.IMAGE="image",c.JAVASCRIPT="javascript",c.JSON="json",c.JSONP="jsonp",c.MANIFEST="manifest",c.SOUND="sound",c.VIDEO="video",c.SPRITESHEET="spritesheet",c.SVG="svg",c.TEXT="text",c.XML="xml",b.getItem=function(){return this._item},b.getResult=function(a){return a?this._rawResult:this._result},b.getTag=function(){return this._tag},b.setTag=function(a){this._tag=a},b.load=function(){this._createRequest(),this._request.on("complete",this,this),this._request.on("progress",this,this),this._request.on("loadStart",this,this),this._request.on("abort",this,this),this._request.on("timeout",this,this),this._request.on("error",this,this);var a=new createjs.Event("initialize");a.loader=this._request,this.dispatchEvent(a),this._request.load()},b.cancel=function(){this.canceled=!0,this.destroy()},b.destroy=function(){this._request&&(this._request.removeAllEventListeners(),this._request.destroy()),this._request=null,this._item=null,this._rawResult=null,this._result=null,this._loadItems=null,this.removeAllEventListeners()},b.getLoadedItems=function(){return this._loadedItems},b._createRequest=function(){this._preferXHR?this._request=new createjs.XHRRequest(this._item):this._request=new createjs.TagRequest(this._item,this._tag||this._createTag(),this._tagSrcAttribute)},b._createTag=function(a){return null},b._sendLoadStart=function(){this._isCanceled()||this.dispatchEvent("loadstart")},b._sendProgress=function(a){if(!this._isCanceled()){var b=null;"number"==typeof a?(this.progress=a,b=new createjs.ProgressEvent(this.progress)):(b=a,this.progress=a.loaded/a.total,b.progress=this.progress,(isNaN(this.progress)||this.progress==1/0)&&(this.progress=0)),this.hasEventListener("progress")&&this.dispatchEvent(b)}},b._sendComplete=function(){if(!this._isCanceled()){this.loaded=!0;var a=new createjs.Event("complete");a.rawResult=this._rawResult,null!=this._result&&(a.result=this._result),this.dispatchEvent(a)}},b._sendError=function(a){!this._isCanceled()&&this.hasEventListener("error")&&(null==a&&(a=new createjs.ErrorEvent("PRELOAD_ERROR_EMPTY")),this.dispatchEvent(a))},b._isCanceled=function(){return!(null!=window.createjs&&!this.canceled)},b.resultFormatter=null,b.handleEvent=function(a){switch(a.type){case"complete":this._rawResult=a.target._response;var b=this.resultFormatter&&this.resultFormatter(this);b instanceof Function?b.call(this,createjs.proxy(this._resultFormatSuccess,this),createjs.proxy(this._resultFormatFailed,this)):(this._result=b||this._rawResult,this._sendComplete());break;case"progress":this._sendProgress(a);break;case"error":this._sendError(a);break;case"loadstart":this._sendLoadStart();break;case"abort":case"timeout":this._isCanceled()||this.dispatchEvent(new createjs.ErrorEvent("PRELOAD_"+a.type.toUpperCase()+"_ERROR"))}},b._resultFormatSuccess=function(a){this._result=a,this._sendComplete()},b._resultFormatFailed=function(a){this._sendError(a)},b.buildPath=function(a,b){return createjs.RequestUtils.buildPath(a,b)},b.toString=function(){return"[PreloadJS AbstractLoader]"},createjs.AbstractLoader=createjs.promote(a,"EventDispatcher")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b,c){this.AbstractLoader_constructor(a,b,c),this.resultFormatter=this._formatResult,this._tagSrcAttribute="src",this.on("initialize",this._updateXHR,this)}var b=createjs.extend(a,createjs.AbstractLoader);b.load=function(){this._tag||(this._tag=this._createTag(this._item.src)),this._tag.preload="auto",this._tag.load(),this.AbstractLoader_load()},b._createTag=function(){},b._createRequest=function(){this._preferXHR?this._request=new createjs.XHRRequest(this._item):this._request=new createjs.MediaTagRequest(this._item,this._tag||this._createTag(),this._tagSrcAttribute)},b._updateXHR=function(a){a.loader.setResponseType&&a.loader.setResponseType("blob")},b._formatResult=function(a){if(this._tag.removeEventListener&&this._tag.removeEventListener("canplaythrough",this._loadedHandler),this._tag.onstalled=null,this._preferXHR){var b=window.URL||window.webkitURL,c=a.getResult(!0);a.getTag().src=b.createObjectURL(c)}return a.getTag()},createjs.AbstractMediaLoader=createjs.promote(a,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(a){this._item=a},b=createjs.extend(a,createjs.EventDispatcher);b.load=function(){},b.destroy=function(){},b.cancel=function(){},createjs.AbstractRequest=createjs.promote(a,"EventDispatcher")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b,c){this.AbstractRequest_constructor(a),this._tag=b,this._tagSrcAttribute=c,this._loadedHandler=createjs.proxy(this._handleTagComplete,this),this._addedToDOM=!1,this._startTagVisibility=null}var b=createjs.extend(a,createjs.AbstractRequest);b.load=function(){this._tag.onload=createjs.proxy(this._handleTagComplete,this),this._tag.onreadystatechange=createjs.proxy(this._handleReadyStateChange,this),this._tag.onerror=createjs.proxy(this._handleError,this);var a=new createjs.Event("initialize");a.loader=this._tag,this.dispatchEvent(a),this._hideTag(),this._loadTimeout=setTimeout(createjs.proxy(this._handleTimeout,this),this._item.loadTimeout),this._tag[this._tagSrcAttribute]=this._item.src,null==this._tag.parentNode&&(window.document.body.appendChild(this._tag),this._addedToDOM=!0)},b.destroy=function(){this._clean(),this._tag=null,this.AbstractRequest_destroy()},b._handleReadyStateChange=function(){clearTimeout(this._loadTimeout);var a=this._tag;"loaded"!=a.readyState&&"complete"!=a.readyState||this._handleTagComplete()},b._handleError=function(){this._clean(),this.dispatchEvent("error")},b._handleTagComplete=function(){this._rawResult=this._tag,this._result=this.resultFormatter&&this.resultFormatter(this)||this._rawResult,this._clean(),this._showTag(),this.dispatchEvent("complete")},b._handleTimeout=function(){this._clean(),this.dispatchEvent(new createjs.Event("timeout"))},b._clean=function(){this._tag.onload=null,this._tag.onreadystatechange=null,this._tag.onerror=null,this._addedToDOM&&null!=this._tag.parentNode&&this._tag.parentNode.removeChild(this._tag),clearTimeout(this._loadTimeout)},b._hideTag=function(){this._startTagVisibility=this._tag.style.visibility,this._tag.style.visibility="hidden"},b._showTag=function(){this._tag.style.visibility=this._startTagVisibility},b._handleStalled=function(){},createjs.TagRequest=createjs.promote(a,"AbstractRequest")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b,c){this.AbstractRequest_constructor(a),this._tag=b,this._tagSrcAttribute=c,this._loadedHandler=createjs.proxy(this._handleTagComplete,this)}var b=createjs.extend(a,createjs.TagRequest);b.load=function(){var a=createjs.proxy(this._handleStalled,this);this._stalledCallback=a;var b=createjs.proxy(this._handleProgress,this);this._handleProgress=b,this._tag.addEventListener("stalled",a),this._tag.addEventListener("progress",b),this._tag.addEventListener&&this._tag.addEventListener("canplaythrough",this._loadedHandler,!1),this.TagRequest_load()},b._handleReadyStateChange=function(){clearTimeout(this._loadTimeout);var a=this._tag;"loaded"!=a.readyState&&"complete"!=a.readyState||this._handleTagComplete()},b._handleStalled=function(){},b._handleProgress=function(a){if(a&&!(a.loaded>0&&0==a.total)){var b=new createjs.ProgressEvent(a.loaded,a.total);this.dispatchEvent(b)}},b._clean=function(){this._tag.removeEventListener&&this._tag.removeEventListener("canplaythrough",this._loadedHandler),this._tag.removeEventListener("stalled",this._stalledCallback),this._tag.removeEventListener("progress",this._progressCallback),this.TagRequest__clean()},createjs.MediaTagRequest=createjs.promote(a,"TagRequest")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a){this.AbstractRequest_constructor(a),this._request=null,this._loadTimeout=null,this._xhrLevel=1,this._response=null,this._rawResponse=null,this._canceled=!1,this._handleLoadStartProxy=createjs.proxy(this._handleLoadStart,this),this._handleProgressProxy=createjs.proxy(this._handleProgress,this),this._handleAbortProxy=createjs.proxy(this._handleAbort,this),this._handleErrorProxy=createjs.proxy(this._handleError,this),this._handleTimeoutProxy=createjs.proxy(this._handleTimeout,this),this._handleLoadProxy=createjs.proxy(this._handleLoad,this),this._handleReadyStateChangeProxy=createjs.proxy(this._handleReadyStateChange,this),!this._createXHR(a)}var b=createjs.extend(a,createjs.AbstractRequest);a.ACTIVEX_VERSIONS=["Msxml2.XMLHTTP.6.0","Msxml2.XMLHTTP.5.0","Msxml2.XMLHTTP.4.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP"],b.getResult=function(a){return a&&this._rawResponse?this._rawResponse:this._response},b.cancel=function(){this.canceled=!0,this._clean(),this._request.abort()},b.load=function(){if(null==this._request)return void this._handleError();null!=this._request.addEventListener?(this._request.addEventListener("loadstart",this._handleLoadStartProxy,!1),this._request.addEventListener("progress",this._handleProgressProxy,!1),this._request.addEventListener("abort",this._handleAbortProxy,!1),this._request.addEventListener("error",this._handleErrorProxy,!1),this._request.addEventListener("timeout",this._handleTimeoutProxy,!1),this._request.addEventListener("load",this._handleLoadProxy,!1),this._request.addEventListener("readystatechange",this._handleReadyStateChangeProxy,!1)):(this._request.onloadstart=this._handleLoadStartProxy,this._request.onprogress=this._handleProgressProxy,this._request.onabort=this._handleAbortProxy,this._request.onerror=this._handleErrorProxy,this._request.ontimeout=this._handleTimeoutProxy,this._request.onload=this._handleLoadProxy,this._request.onreadystatechange=this._handleReadyStateChangeProxy),1==this._xhrLevel&&(this._loadTimeout=setTimeout(createjs.proxy(this._handleTimeout,this),this._item.loadTimeout));try{this._item.values&&this._item.method!=createjs.AbstractLoader.GET?this._item.method==createjs.AbstractLoader.POST&&this._request.send(createjs.RequestUtils.formatQueryString(this._item.values)):this._request.send()}catch(a){this.dispatchEvent(new createjs.ErrorEvent("XHR_SEND",null,a))}},b.setResponseType=function(a){"blob"===a&&(a=window.URL?"blob":"arraybuffer",this._responseType=a),this._request.responseType=a},b.getAllResponseHeaders=function(){return this._request.getAllResponseHeaders instanceof Function?this._request.getAllResponseHeaders():null},b.getResponseHeader=function(a){return this._request.getResponseHeader instanceof Function?this._request.getResponseHeader(a):null},b._handleProgress=function(a){if(a&&!(a.loaded>0&&0==a.total)){var b=new createjs.ProgressEvent(a.loaded,a.total);this.dispatchEvent(b)}},b._handleLoadStart=function(a){clearTimeout(this._loadTimeout),this.dispatchEvent("loadstart")},b._handleAbort=function(a){this._clean(),this.dispatchEvent(new createjs.ErrorEvent("XHR_ABORTED",null,a))},b._handleError=function(a){this._clean(),this.dispatchEvent(new createjs.ErrorEvent(a.message))},b._handleReadyStateChange=function(a){4==this._request.readyState&&this._handleLoad()},b._handleLoad=function(a){if(!this.loaded){this.loaded=!0;var b=this._checkError();if(b)return void this._handleError(b);if(this._response=this._getResponse(),"arraybuffer"===this._responseType)try{this._response=new Blob([this._response])}catch(a){if(window.BlobBuilder=window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder||window.MSBlobBuilder,"TypeError"===a.name&&window.BlobBuilder){var c=new BlobBuilder;c.append(this._response),this._response=c.getBlob()}}this._clean(),this.dispatchEvent(new createjs.Event("complete"))}},b._handleTimeout=function(a){this._clean(),this.dispatchEvent(new createjs.ErrorEvent("PRELOAD_TIMEOUT",null,a))},b._checkError=function(){var a=parseInt(this._request.status);switch(a){case 404:case 0:return new Error(a)}return null},b._getResponse=function(){if(null!=this._response)return this._response;if(null!=this._request.response)return this._request.response;try{if(null!=this._request.responseText)return this._request.responseText}catch(a){}try{if(null!=this._request.responseXML)return this._request.responseXML}catch(a){}return null},b._createXHR=function(a){var b=createjs.RequestUtils.isCrossDomain(a),c={},d=null;if(window.XMLHttpRequest)d=new XMLHttpRequest,b&&void 0===d.withCredentials&&window.XDomainRequest&&(d=new XDomainRequest);else{for(var e=0,f=s.ACTIVEX_VERSIONS.length;e<f;e++){var g=s.ACTIVEX_VERSIONS[e];try{d=new ActiveXObject(g);break}catch(a){}}if(null==d)return!1}null==a.mimeType&&createjs.RequestUtils.isText(a.type)&&(a.mimeType="text/plain; charset=utf-8"),a.mimeType&&d.overrideMimeType&&d.overrideMimeType(a.mimeType),this._xhrLevel="string"==typeof d.responseType?2:1;var h=null;if(h=a.method==createjs.AbstractLoader.GET?createjs.RequestUtils.buildPath(a.src,a.values):a.src,d.open(a.method||createjs.AbstractLoader.GET,h,!0),b&&d instanceof XMLHttpRequest&&1==this._xhrLevel&&(c.Origin=location.origin),a.values&&a.method==createjs.AbstractLoader.POST&&(c["Content-Type"]="application/x-www-form-urlencoded"),b||c["X-Requested-With"]||(c["X-Requested-With"]="XMLHttpRequest"),a.headers)for(var i in a.headers)c[i]=a.headers[i];for(i in c)d.setRequestHeader(i,c[i]);return d instanceof XMLHttpRequest&&void 0!==a.withCredentials&&(d.withCredentials=a.withCredentials),this._request=d,!0},b._clean=function(){clearTimeout(this._loadTimeout),null!=this._request.removeEventListener?(this._request.removeEventListener("loadstart",this._handleLoadStartProxy),this._request.removeEventListener("progress",this._handleProgressProxy),this._request.removeEventListener("abort",this._handleAbortProxy),this._request.removeEventListener("error",this._handleErrorProxy),this._request.removeEventListener("timeout",this._handleTimeoutProxy),this._request.removeEventListener("load",this._handleLoadProxy),this._request.removeEventListener("readystatechange",this._handleReadyStateChangeProxy)):(this._request.onloadstart=null,this._request.onprogress=null,this._request.onabort=null,this._request.onerror=null,this._request.ontimeout=null,this._request.onload=null,this._request.onreadystatechange=null)},b.toString=function(){return"[PreloadJS XHRRequest]"},createjs.XHRRequest=createjs.promote(a,"AbstractRequest")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b,c){this.AbstractLoader_constructor(),this._plugins=[],this._typeCallbacks={},this._extensionCallbacks={},this.next=null,this.maintainScriptOrder=!0,this.stopOnError=!1,this._maxConnections=1,this._availableLoaders=[createjs.ImageLoader,createjs.JavaScriptLoader,createjs.CSSLoader,createjs.JSONLoader,createjs.JSONPLoader,createjs.SoundLoader,createjs.ManifestLoader,createjs.SpriteSheetLoader,createjs.XMLLoader,createjs.SVGLoader,createjs.BinaryLoader,createjs.VideoLoader,createjs.TextLoader],this._defaultLoaderLength=this._availableLoaders.length,this.init(a,b,c)}var b=createjs.extend(a,createjs.AbstractLoader),c=a;b.init=function(a,b,c){this.useXHR=!0,this.preferXHR=!0,this._preferXHR=!0,this.setPreferXHR(a),this._paused=!1,this._basePath=b,this._crossOrigin=c,this._loadStartWasDispatched=!1,this._currentlyLoadingScript=null,this._currentLoads=[],this._loadQueue=[],this._loadQueueBackup=[],this._loadItemsById={},this._loadItemsBySrc={},this._loadedResults={},this._loadedRawResults={},this._numItems=0,this._numItemsLoaded=0,this._scriptOrder=[],this._loadedScripts=[],this._lastProgress=NaN},c.loadTimeout=8e3,c.LOAD_TIMEOUT=0,c.BINARY=createjs.AbstractLoader.BINARY,c.CSS=createjs.AbstractLoader.CSS,c.IMAGE=createjs.AbstractLoader.IMAGE,c.JAVASCRIPT=createjs.AbstractLoader.JAVASCRIPT,c.JSON=createjs.AbstractLoader.JSON,c.JSONP=createjs.AbstractLoader.JSONP,c.MANIFEST=createjs.AbstractLoader.MANIFEST,c.SOUND=createjs.AbstractLoader.SOUND,c.VIDEO=createjs.AbstractLoader.VIDEO,c.SVG=createjs.AbstractLoader.SVG,c.TEXT=createjs.AbstractLoader.TEXT,c.XML=createjs.AbstractLoader.XML,c.POST=createjs.AbstractLoader.POST,c.GET=createjs.AbstractLoader.GET,b.registerLoader=function(a){if(!a||!a.canLoadItem)throw new Error("loader is of an incorrect type.");if(this._availableLoaders.indexOf(a)!=-1)throw new Error("loader already exists.");this._availableLoaders.unshift(a)},b.unregisterLoader=function(a){var b=this._availableLoaders.indexOf(a);b!=-1&&b<this._defaultLoaderLength-1&&this._availableLoaders.splice(b,1)},b.setUseXHR=function(a){return this.setPreferXHR(a)},b.setPreferXHR=function(a){return this.preferXHR=0!=a&&null!=window.XMLHttpRequest,this.preferXHR},b.removeAll=function(){this.remove()},b.remove=function(a){var b=null;if(a&&!Array.isArray(a))b=[a];else if(a)b=a;else if(arguments.length>0)return;var c=!1;if(b){for(;b.length;){var e=b.pop(),f=this.getResult(e);for(g=this._loadQueue.length-1;g>=0;g--)if(h=this._loadQueue[g].getItem(),h.id==e||h.src==e){this._loadQueue.splice(g,1)[0].cancel();break}for(g=this._loadQueueBackup.length-1;g>=0;g--)if(h=this._loadQueueBackup[g].getItem(),h.id==e||h.src==e){this._loadQueueBackup.splice(g,1)[0].cancel();break}if(f)this._disposeItem(this.getItem(e));else for(var g=this._currentLoads.length-1;g>=0;g--){var h=this._currentLoads[g].getItem();if(h.id==e||h.src==e){this._currentLoads.splice(g,1)[0].cancel(),c=!0;break}}}c&&this._loadNext()}else{this.close();for(var d in this._loadItemsById)this._disposeItem(this._loadItemsById[d]);this.init(this.preferXHR,this._basePath)}},b.reset=function(){this.close();for(var a in this._loadItemsById)this._disposeItem(this._loadItemsById[a]);for(var b=[],c=0,d=this._loadQueueBackup.length;c<d;c++)b.push(this._loadQueueBackup[c].getItem());this.loadManifest(b,!1)},b.installPlugin=function(a){if(null!=a&&null!=a.getPreloadHandlers){this._plugins.push(a);var b=a.getPreloadHandlers();if(b.scope=a,null!=b.types)for(var c=0,d=b.types.length;c<d;c++)this._typeCallbacks[b.types[c]]=b;if(null!=b.extensions)for(c=0,d=b.extensions.length;c<d;c++)this._extensionCallbacks[b.extensions[c]]=b}},b.setMaxConnections=function(a){this._maxConnections=a,!this._paused&&this._loadQueue.length>0&&this._loadNext()},b.loadFile=function(a,b,c){if(null==a){var d=new createjs.ErrorEvent("PRELOAD_NO_FILE");return void this._sendError(d)}this._addItem(a,null,c),b!==!1?this.setPaused(!1):this.setPaused(!0)},b.loadManifest=function(a,b,d){var e=null,f=null;if(Array.isArray(a)){if(0==a.length){var g=new createjs.ErrorEvent("PRELOAD_MANIFEST_EMPTY");return void this._sendError(g)}e=a}else if("string"==typeof a)e=[{src:a,type:c.MANIFEST}];else{if("object"!=typeof a){var g=new createjs.ErrorEvent("PRELOAD_MANIFEST_NULL");return void this._sendError(g)}if(void 0!==a.src){if(null==a.type)a.type=c.MANIFEST;else if(a.type!=c.MANIFEST){var g=new createjs.ErrorEvent("PRELOAD_MANIFEST_TYPE");this._sendError(g)}e=[a]}else void 0!==a.manifest&&(e=a.manifest,f=a.path)}for(var h=0,i=e.length;h<i;h++)this._addItem(e[h],f,d);b!==!1?this.setPaused(!1):this.setPaused(!0)},b.load=function(){this.setPaused(!1)},b.getItem=function(a){return this._loadItemsById[a]||this._loadItemsBySrc[a]},b.getResult=function(a,b){var c=this._loadItemsById[a]||this._loadItemsBySrc[a];if(null==c)return null;var d=c.id;return b&&this._loadedRawResults[d]?this._loadedRawResults[d]:this._loadedResults[d]},b.getItems=function(a){var b=[];for(var c in this._loadItemsById){var d=this._loadItemsById[c],e=this.getResult(c);a===!0&&null==e||b.push({item:d,result:e,rawResult:this.getResult(c,!0)})}return b},b.setPaused=function(a){this._paused=a,this._paused||this._loadNext()},b.close=function(){for(;this._currentLoads.length;)this._currentLoads.pop().cancel();this._scriptOrder.length=0,this._loadedScripts.length=0,this.loadStartWasDispatched=!1,this._itemCount=0,this._lastProgress=NaN},b._addItem=function(a,b,c){var d=this._createLoadItem(a,b,c);if(null!=d){var e=this._createLoader(d);null!=e&&("plugins"in e&&(e.plugins=this._plugins),d._loader=e,this._loadQueue.push(e),this._loadQueueBackup.push(e),this._numItems++,this._updateProgress(),(this.maintainScriptOrder&&d.type==createjs.LoadQueue.JAVASCRIPT||d.maintainOrder===!0)&&(this._scriptOrder.push(d),this._loadedScripts.push(null)))}},b._createLoadItem=function(a,b,c){var d=createjs.LoadItem.create(a);if(null==d)return null;var e="",f=c||this._basePath;if(d.src instanceof Object){if(!d.type)return null;if(b){e=b;var g=createjs.RequestUtils.parseURI(b);null==f||g.absolute||g.relative||(e=f+e)}else null!=f&&(e=f)}else{var h=createjs.RequestUtils.parseURI(d.src);h.extension&&(d.ext=h.extension),null==d.type&&(d.type=createjs.RequestUtils.getTypeByExtension(d.ext));var i=d.src;if(!h.absolute&&!h.relative)if(b){e=b;var g=createjs.RequestUtils.parseURI(b);i=b+i,null==f||g.absolute||g.relative||(e=f+e)}else null!=f&&(e=f);d.src=e+d.src}d.path=e,void 0!==d.id&&null!==d.id&&""!==d.id||(d.id=i);var j=this._typeCallbacks[d.type]||this._extensionCallbacks[d.ext];if(j){var k=j.callback.call(j.scope,d,this);if(k===!1)return null;k===!0||null!=k&&(d._loader=k),h=createjs.RequestUtils.parseURI(d.src),null!=h.extension&&(d.ext=h.extension)}return this._loadItemsById[d.id]=d,this._loadItemsBySrc[d.src]=d,null==d.crossOrigin&&(d.crossOrigin=this._crossOrigin),d},b._createLoader=function(a){if(null!=a._loader)return a._loader;for(var b=this.preferXHR,c=0;c<this._availableLoaders.length;c++){var d=this._availableLoaders[c];if(d&&d.canLoadItem(a))return new d(a,b)}return null},b._loadNext=function(){if(!this._paused){this._loadStartWasDispatched||(this._sendLoadStart(),this._loadStartWasDispatched=!0),this._numItems==this._numItemsLoaded?(this.loaded=!0,this._sendComplete(),this.next&&this.next.load&&this.next.load()):this.loaded=!1;for(var a=0;a<this._loadQueue.length&&!(this._currentLoads.length>=this._maxConnections);a++){var b=this._loadQueue[a];this._canStartLoad(b)&&(this._loadQueue.splice(a,1),a--,this._loadItem(b))}}},b._loadItem=function(a){a.on("fileload",this._handleFileLoad,this),a.on("progress",this._handleProgress,this),a.on("complete",this._handleFileComplete,this),a.on("error",this._handleError,this),a.on("fileerror",this._handleFileError,this),this._currentLoads.push(a),this._sendFileStart(a.getItem()),a.load()},b._handleFileLoad=function(a){a.target=null,this.dispatchEvent(a)},b._handleFileError=function(a){var b=new createjs.ErrorEvent("FILE_LOAD_ERROR",null,a.item);this._sendError(b)},b._handleError=function(a){var b=a.target;this._numItemsLoaded++,this._finishOrderedItem(b,!0),this._updateProgress();var c=new createjs.ErrorEvent("FILE_LOAD_ERROR",null,b.getItem());this._sendError(c),this.stopOnError?this.setPaused(!0):(this._removeLoadItem(b),this._cleanLoadItem(b),this._loadNext())},b._handleFileComplete=function(a){var b=a.target,c=b.getItem(),d=b.getResult();this._loadedResults[c.id]=d;var e=b.getResult(!0);null!=e&&e!==d&&(this._loadedRawResults[c.id]=e),this._saveLoadedItems(b),this._removeLoadItem(b),this._finishOrderedItem(b)||this._processFinishedLoad(c,b),this._cleanLoadItem(b)},b._saveLoadedItems=function(a){var b=a.getLoadedItems();if(null!==b)for(var c=0;c<b.length;c++){var d=b[c].item;this._loadItemsBySrc[d.src]=d,this._loadItemsById[d.id]=d,this._loadedResults[d.id]=b[c].result,this._loadedRawResults[d.id]=b[c].rawResult}},b._finishOrderedItem=function(a,b){var c=a.getItem();if(this.maintainScriptOrder&&c.type==createjs.LoadQueue.JAVASCRIPT||c.maintainOrder){a instanceof createjs.JavaScriptLoader&&(this._currentlyLoadingScript=!1);var d=createjs.indexOf(this._scriptOrder,c);return d!=-1&&(this._loadedScripts[d]=b===!0||c,this._checkScriptLoadOrder(),!0)}return!1},b._checkScriptLoadOrder=function(){for(var a=this._loadedScripts.length,b=0;b<a;b++){var c=this._loadedScripts[b];if(null===c)break;if(c!==!0){var d=this._loadedResults[c.id];c.type==createjs.LoadQueue.JAVASCRIPT&&createjs.DomUtils.appendToHead(d);var e=c._loader;this._processFinishedLoad(c,e),this._loadedScripts[b]=!0}}},b._processFinishedLoad=function(a,b){if(this._numItemsLoaded++,!this.maintainScriptOrder&&a.type==createjs.LoadQueue.JAVASCRIPT){var c=b.getTag();createjs.DomUtils.appendToHead(c)}this._updateProgress(),this._sendFileComplete(a,b),this._loadNext()},b._canStartLoad=function(a){if(!this.maintainScriptOrder||a.preferXHR)return!0;var b=a.getItem();if(b.type!=createjs.LoadQueue.JAVASCRIPT)return!0;if(this._currentlyLoadingScript)return!1;for(var c=this._scriptOrder.indexOf(b),d=0;d<c;){var e=this._loadedScripts[d];if(null==e)return!1;d++}return this._currentlyLoadingScript=!0,!0},b._removeLoadItem=function(a){for(var b=this._currentLoads.length,c=0;c<b;c++)if(this._currentLoads[c]==a){this._currentLoads.splice(c,1);break}},b._cleanLoadItem=function(a){var b=a.getItem();b&&delete b._loader},b._handleProgress=function(a){var b=a.target;this._sendFileProgress(b.getItem(),b.progress),this._updateProgress()},b._updateProgress=function(){var a=this._numItemsLoaded/this._numItems,b=this._numItems-this._numItemsLoaded;if(b>0){for(var c=0,d=0,e=this._currentLoads.length;d<e;d++)c+=this._currentLoads[d].progress;a+=c/b*(b/this._numItems)}this._lastProgress!=a&&(this._sendProgress(a),this._lastProgress=a)},b._disposeItem=function(a){delete this._loadedResults[a.id],delete this._loadedRawResults[a.id],delete this._loadItemsById[a.id],delete this._loadItemsBySrc[a.src]},b._sendFileProgress=function(a,b){if(!this._isCanceled()&&!this._paused&&this.hasEventListener("fileprogress")){var c=new createjs.Event("fileprogress");c.progress=b,c.loaded=b,c.total=1,c.item=a,this.dispatchEvent(c)}},b._sendFileComplete=function(a,b){if(!this._isCanceled()&&!this._paused){var c=new createjs.Event("fileload");c.loader=b,c.item=a,c.result=this._loadedResults[a.id],c.rawResult=this._loadedRawResults[a.id],a.completeHandler&&a.completeHandler(c),this.hasEventListener("fileload")&&this.dispatchEvent(c)}},b._sendFileStart=function(a){var b=new createjs.Event("filestart");b.item=a,this.hasEventListener("filestart")&&this.dispatchEvent(b)},b.toString=function(){return"[PreloadJS LoadQueue]"},createjs.LoadQueue=createjs.promote(a,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a){this.AbstractLoader_constructor(a,!0,createjs.AbstractLoader.TEXT)}var c=(createjs.extend(a,createjs.AbstractLoader),a);c.canLoadItem=function(a){return a.type==createjs.AbstractLoader.TEXT},createjs.TextLoader=createjs.promote(a,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a){this.AbstractLoader_constructor(a,!0,createjs.AbstractLoader.BINARY),this.on("initialize",this._updateXHR,this)}var b=createjs.extend(a,createjs.AbstractLoader),c=a;c.canLoadItem=function(a){return a.type==createjs.AbstractLoader.BINARY},b._updateXHR=function(a){a.loader.setResponseType("arraybuffer")},createjs.BinaryLoader=createjs.promote(a,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b){this.AbstractLoader_constructor(a,b,createjs.AbstractLoader.CSS),this.resultFormatter=this._formatResult,this._tagSrcAttribute="href",b?this._tag=document.createElement("style"):this._tag=document.createElement("link"),this._tag.rel="stylesheet",this._tag.type="text/css"}var b=createjs.extend(a,createjs.AbstractLoader),c=a;c.canLoadItem=function(a){return a.type==createjs.AbstractLoader.CSS},b._formatResult=function(a){if(this._preferXHR){var b=a.getTag();if(b.styleSheet)b.styleSheet.cssText=a.getResult(!0);else{var c=document.createTextNode(a.getResult(!0));b.appendChild(c)}}else b=this._tag;return createjs.DomUtils.appendToHead(b),b},createjs.CSSLoader=createjs.promote(a,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b){this.AbstractLoader_constructor(a,b,createjs.AbstractLoader.IMAGE),this.resultFormatter=this._formatResult,this._tagSrcAttribute="src",createjs.RequestUtils.isImageTag(a)?this._tag=a:createjs.RequestUtils.isImageTag(a.src)?this._tag=a.src:createjs.RequestUtils.isImageTag(a.tag)&&(this._tag=a.tag),null!=this._tag?this._preferXHR=!1:this._tag=document.createElement("img"),this.on("initialize",this._updateXHR,this)}var b=createjs.extend(a,createjs.AbstractLoader),c=a;c.canLoadItem=function(a){return a.type==createjs.AbstractLoader.IMAGE},b.load=function(){if(""!=this._tag.src&&this._tag.complete)return void this._sendComplete();var a=this._item.crossOrigin;1==a&&(a="Anonymous"),null==a||createjs.RequestUtils.isLocal(this._item.src)||(this._tag.crossOrigin=a),this.AbstractLoader_load()},b._updateXHR=function(a){a.loader.mimeType="text/plain; charset=x-user-defined-binary",a.loader.setResponseType&&a.loader.setResponseType("blob")},b._formatResult=function(a){return this._formatImage},b._formatImage=function(a,b){var c=this._tag,d=window.URL||window.webkitURL;if(this._preferXHR)if(d){var e=d.createObjectURL(this.getResult(!0));c.src=e,c.addEventListener("load",this._cleanUpURL,!1),c.addEventListener("error",this._cleanUpURL,!1)}else c.src=this._item.src;else;c.complete?a(c):(c.onload=createjs.proxy(function(){a(this._tag)},this),c.onerror=createjs.proxy(function(){b(_this._tag)},this))},b._cleanUpURL=function(a){},createjs.ImageLoader=createjs.promote(a,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b){this.AbstractLoader_constructor(a,b,createjs.AbstractLoader.JAVASCRIPT),this.resultFormatter=this._formatResult,this._tagSrcAttribute="src",this.setTag(document.createElement("script"))}var b=createjs.extend(a,createjs.AbstractLoader),c=a;c.canLoadItem=function(a){return a.type==createjs.AbstractLoader.JAVASCRIPT},b._formatResult=function(a){var b=a.getTag();return this._preferXHR&&(b.text=a.getResult(!0)),b},createjs.JavaScriptLoader=createjs.promote(a,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a){this.AbstractLoader_constructor(a,!0,createjs.AbstractLoader.JSON),this.resultFormatter=this._formatResult}var b=createjs.extend(a,createjs.AbstractLoader),c=a;c.canLoadItem=function(a){return a.type==createjs.AbstractLoader.JSON},b._formatResult=function(a){var b=null;try{b=createjs.DataUtils.parseJSON(a.getResult(!0))}catch(a){var c=new createjs.ErrorEvent("JSON_FORMAT",null,a);return this._sendError(c),a}return b},createjs.JSONLoader=createjs.promote(a,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a){this.AbstractLoader_constructor(a,!1,createjs.AbstractLoader.JSONP),this.setTag(document.createElement("script")),this.getTag().type="text/javascript"}var b=createjs.extend(a,createjs.AbstractLoader),c=a;c.canLoadItem=function(a){return a.type==createjs.AbstractLoader.JSONP},b.cancel=function(){this.AbstractLoader_cancel(),this._dispose()},b.load=function(){if(null==this._item.callback)throw new Error("callback is required for loading JSONP requests.");if(null!=window[this._item.callback])throw new Error("JSONP callback '"+this._item.callback+"' already exists on window. You need to specify a different callback or re-name the current one.");window[this._item.callback]=createjs.proxy(this._handleLoad,this),window.document.body.appendChild(this._tag),this._loadTimeout=setTimeout(createjs.proxy(this._handleTimeout,this),this._item.loadTimeout),this._tag.src=this._item.src},b._handleLoad=function(a){this._result=this._rawResult=a,this._sendComplete(),this._dispose()},b._handleTimeout=function(){this._dispose(),this.dispatchEvent(new createjs.ErrorEvent("timeout"))},b._dispose=function(){window.document.body.removeChild(this._tag),delete window[this._item.callback],clearTimeout(this._loadTimeout)},createjs.JSONPLoader=createjs.promote(a,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a){this.AbstractLoader_constructor(a,null,createjs.AbstractLoader.MANIFEST),this.plugins=null,this._manifestQueue=null}var b=createjs.extend(a,createjs.AbstractLoader),c=a;c.MANIFEST_PROGRESS=.25,c.canLoadItem=function(a){return a.type==createjs.AbstractLoader.MANIFEST},b.load=function(){this.AbstractLoader_load()},b._createRequest=function(){var a=this._item.callback;null!=a?this._request=new createjs.JSONPLoader(this._item):this._request=new createjs.JSONLoader(this._item)},b.handleEvent=function(a){switch(a.type){case"complete":return this._rawResult=a.target.getResult(!0),this._result=a.target.getResult(),this._sendProgress(c.MANIFEST_PROGRESS),void this._loadManifest(this._result);case"progress":return a.loaded*=c.MANIFEST_PROGRESS,this.progress=a.loaded/a.total,(isNaN(this.progress)||this.progress==1/0)&&(this.progress=0),void this._sendProgress(a)}this.AbstractLoader_handleEvent(a)},b.destroy=function(){this.AbstractLoader_destroy(),this._manifestQueue.close()},b._loadManifest=function(a){if(a&&a.manifest){var b=this._manifestQueue=new createjs.LoadQueue;b.on("fileload",this._handleManifestFileLoad,this),b.on("progress",this._handleManifestProgress,this),b.on("complete",this._handleManifestComplete,this,!0),b.on("error",this._handleManifestError,this,!0);for(var c=0,d=this.plugins.length;c<d;c++)b.installPlugin(this.plugins[c]);b.loadManifest(a)}else this._sendComplete()},b._handleManifestFileLoad=function(a){a.target=null,this.dispatchEvent(a)},b._handleManifestComplete=function(a){this._loadedItems=this._manifestQueue.getItems(!0),this._sendComplete()},b._handleManifestProgress=function(a){this.progress=a.progress*(1-c.MANIFEST_PROGRESS)+c.MANIFEST_PROGRESS,this._sendProgress(this.progress)},b._handleManifestError=function(a){var b=new createjs.Event("fileerror");b.item=a.data,this.dispatchEvent(b)},createjs.ManifestLoader=createjs.promote(a,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b){this.AbstractMediaLoader_constructor(a,b,createjs.AbstractLoader.SOUND),createjs.RequestUtils.isAudioTag(a)?this._tag=a:createjs.RequestUtils.isAudioTag(a.src)?this._tag=a:createjs.RequestUtils.isAudioTag(a.tag)&&(this._tag=createjs.RequestUtils.isAudioTag(a)?a:a.src),null!=this._tag&&(this._preferXHR=!1)}var b=createjs.extend(a,createjs.AbstractMediaLoader),c=a;c.canLoadItem=function(a){return a.type==createjs.AbstractLoader.SOUND},b._createTag=function(a){var b=document.createElement("audio");return b.autoplay=!1,b.preload="none",b.src=a,b},createjs.SoundLoader=createjs.promote(a,"AbstractMediaLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b){this.AbstractMediaLoader_constructor(a,b,createjs.AbstractLoader.VIDEO),createjs.RequestUtils.isVideoTag(a)||createjs.RequestUtils.isVideoTag(a.src)?(this.setTag(createjs.RequestUtils.isVideoTag(a)?a:a.src),this._preferXHR=!1):this.setTag(this._createTag())}var b=createjs.extend(a,createjs.AbstractMediaLoader),c=a;b._createTag=function(){return document.createElement("video")},c.canLoadItem=function(a){return a.type==createjs.AbstractLoader.VIDEO},createjs.VideoLoader=createjs.promote(a,"AbstractMediaLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b){this.AbstractLoader_constructor(a,b,createjs.AbstractLoader.SPRITESHEET),this._manifestQueue=null}var b=createjs.extend(a,createjs.AbstractLoader),c=a;c.SPRITESHEET_PROGRESS=.25,c.canLoadItem=function(a){return a.type==createjs.AbstractLoader.SPRITESHEET},b.destroy=function(){this.AbstractLoader_destroy,this._manifestQueue.close()},b._createRequest=function(){var a=this._item.callback;null!=a?this._request=new createjs.JSONPLoader(this._item):this._request=new createjs.JSONLoader(this._item)},b.handleEvent=function(a){switch(a.type){case"complete":return this._rawResult=a.target.getResult(!0),this._result=a.target.getResult(),this._sendProgress(c.SPRITESHEET_PROGRESS),void this._loadManifest(this._result);case"progress":return a.loaded*=c.SPRITESHEET_PROGRESS,this.progress=a.loaded/a.total,(isNaN(this.progress)||this.progress==1/0)&&(this.progress=0),void this._sendProgress(a)}this.AbstractLoader_handleEvent(a)},b._loadManifest=function(a){if(a&&a.images){var b=this._manifestQueue=new createjs.LoadQueue(this._preferXHR,this._item.path,this._item.crossOrigin);b.on("complete",this._handleManifestComplete,this,!0),b.on("fileload",this._handleManifestFileLoad,this),b.on("progress",this._handleManifestProgress,this),b.on("error",this._handleManifestError,this,!0),b.loadManifest(a.images)}},b._handleManifestFileLoad=function(a){var b=a.result;if(null!=b){var c=this.getResult().images,d=c.indexOf(a.item.src);c[d]=b}},b._handleManifestComplete=function(a){this._result=new createjs.SpriteSheet(this._result),this._loadedItems=this._manifestQueue.getItems(!0),this._sendComplete()},b._handleManifestProgress=function(a){this.progress=a.progress*(1-c.SPRITESHEET_PROGRESS)+c.SPRITESHEET_PROGRESS,this._sendProgress(this.progress)},b._handleManifestError=function(a){var b=new createjs.Event("fileerror");b.item=a.data,this.dispatchEvent(b)},createjs.SpriteSheetLoader=createjs.promote(a,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b){this.AbstractLoader_constructor(a,b,createjs.AbstractLoader.SVG),this.resultFormatter=this._formatResult,this._tagSrcAttribute="data",b?this.setTag(document.createElement("svg")):(this.setTag(document.createElement("object")),this.getTag().type="image/svg+xml")}var b=createjs.extend(a,createjs.AbstractLoader),c=a;c.canLoadItem=function(a){return a.type==createjs.AbstractLoader.SVG},b._formatResult=function(a){var b=createjs.DataUtils.parseXML(a.getResult(!0),"text/xml"),c=a.getTag();return!this._preferXHR&&document.body.contains(c)&&document.body.removeChild(c),null!=b.documentElement?(c.appendChild(b.documentElement),c.style.visibility="visible",c):b},createjs.SVGLoader=createjs.promote(a,"AbstractLoader")}(),this.createjs=this.createjs||{},function(){"use strict";function a(a){this.AbstractLoader_constructor(a,!0,createjs.AbstractLoader.XML),this.resultFormatter=this._formatResult}var b=createjs.extend(a,createjs.AbstractLoader),c=a;c.canLoadItem=function(a){return a.type==createjs.AbstractLoader.XML},b._formatResult=function(a){return createjs.DataUtils.parseXML(a.getResult(!0),"text/xml")},createjs.XMLLoader=createjs.promote(a,"AbstractLoader")}();;
createjs.EventDispatcher.prototype.___on = createjs.EventDispatcher.prototype.on;
createjs.EventDispatcher.prototype.on = function() {
  if (arguments.length === 2) {
    return this.addEventListener.apply(this, arguments);
  } else {
    return this.___on.apply(this, arguments);
  }
};
var NumberUtils;
NumberUtils = (function() {
  function NumberUtils() {}
  NumberUtils.isEven = function(p_value) {
    if (p_value % 2 === 0) {
      return true;
    } else {
      return false;
    }
  };
  NumberUtils.isZero = function(p_value) {
    return Math.abs(p_value) < 0.00001;
  };
  NumberUtils.toPercent = function(p_value, p_min, p_max) {
    return ((p_value - p_min) / (p_max - p_min)) * 100;
  };
  NumberUtils.percentToValue = function(p_percent, p_min, p_max) {
    return ((p_max - p_min) * p_percent) + p_min;
  };
  NumberUtils.getBytesAsMegabytes = function(p_bytes) {
    return (Math.floor((p_bytes / 1024 / 1024) * 100) / 100) + " MB";
  };
  NumberUtils.bytesTo = function(p_bytes) {
    if (p_bytes >= 1000000000) {
      return (p_bytes / 1000000000).toFixed(2) + ' GB';
    } else if (p_bytes >= 1000000) {
      return (p_bytes / 1000000).toFixed(2) + ' MB';
    } else if (p_bytes >= 1000) {
      return (p_bytes / 1000).toFixed(2) + ' KB';
    } else if (p_bytes > 1) {
      return p_bytes + ' bytes';
    } else if (p_bytes === 1) {
      return p_bytes + ' byte';
    } else {
      return '0 byte';
    }
  };
  NumberUtils.rangeRandom = function(p_low, p_high, p_rounded) {
    if (p_rounded == null) {
      p_rounded = false;
    }
    if (!p_rounded) {
      return (Math.random() * (p_high - p_low)) + p_low;
    } else {
      return Math.round(Math.round(Math.random() * (p_high - p_low)) + p_low);
    }
  };
  NumberUtils.distanceBetweenCoordinates = function(p_from, p_to, p_units) {
    var a, c, dLatitude, dLongitude, radius;
    if (p_units == null) {
      p_units = "km";
    }
    radius;
    switch (p_units) {
      case "km":
        radius = 6371;
        break;
      case "meters":
        radius = 6378000;
        break;
      case "feet":
        radius = 20925525;
        break;
      case "miles":
        radius = 3963;
    }
    dLatitude = (p_to.x - p_from.x) * Math.PI / 180;
    dLongitude = (p_to.y - p_from.y) * Math.PI / 180;
    a = Math.sin(dLatitude / 2) * Math.sin(dLatitude / 2) + Math.sin(dLongitude / 2) * Math.sin(dLongitude / 2) * Math.cos(p_from.x * Math.PI / 180) * Math.cos(p_to.x * Math.PI / 180);
    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return radius * c;
  };
  return NumberUtils;
})();
/**
Bunch of utilities methods for Array
@class ArrayUtils
@static
 */
var ArrayUtils;
ArrayUtils = (function() {
  function ArrayUtils() {}
  ArrayUtils.removeItem = function(p_array, p_item, p_clone) {
    var k, result, v, _i, _len;
    if (p_clone == null) {
      p_clone = false;
    }
    result = p_clone ? p_array.slice(0) : p_array;
    for (v = _i = 0, _len = result.length; _i < _len; v = ++_i) {
      k = result[v];
      if (k === p_item) {
        result.splice(v, 1);
      }
    }
    return result;
  };
  ArrayUtils.removeItemByIndex = function(p_index, p_array, p_clone) {
    var result;
    if (p_clone == null) {
      p_clone = false;
    }
    result = p_clone ? p_array.slice(0) : p_array;
    result.splice(p_index, 1);
    return result;
  };
  ArrayUtils.removeDuplicateStrings = function(p_array, p_clone) {
    if (p_clone == null) {
      p_clone = false;
    }
    return p_array.filter(function(el, pos, self) {
      return self.indexOf(el) === pos;
    });
  };
  ArrayUtils.hasItem = function(p_value, p_array) {
    return p_array.indexOf(p_value) > -1;
  };
  ArrayUtils.merge = function(p_arrayA, p_arrayB) {
    var i, j, result;
    i = 0;
    j = 0;
    result = [];
    while ((i < p_arrayA.length) || (j < p_arrayB.length)) {
      if (i < p_arrayA.length) {
        result.push(p_arrayA[i]);
        i++;
      }
      if (j < p_arrayB.length) {
        result.push(p_arrayB[j]);
        j++;
      }
    }
    return result;
  };
  ArrayUtils.randomIndex = function(p_array) {
    return NumberUtils.rangeRandom(0, p_array.length - 1, true);
  };
  ArrayUtils.randomItem = function(p_array) {
    return p_array[ArrayUtils.randomIndex(p_array)];
  };
  ArrayUtils.shuffle = function(p_array, p_clone) {
    var i, item, random, result, temp, _i, _len;
    if (p_clone == null) {
      p_clone = false;
    }
    result = p_clone ? p_array.slice(0) : p_array;
    for (i = _i = 0, _len = result.length; _i < _len; i = ++_i) {
      item = result[i];
      random = Math.floor(Math.random() * result.length);
      temp = result[i];
      result[i] = result[random];
      result[random] = temp;
    }
    return result;
  };
  ArrayUtils.move = function(p_array, p_oldIndex, p_newIndex, p_clone) {
    var k, result;
    if (p_clone == null) {
      p_clone = false;
    }
    result = p_clone ? p_array.slice(0) : p_array;
    if (p_newIndex >= result.length) {
      k = new_index - result.length;
      while ((k--) + 1) {
        result.push(void 0);
      }
    }
    result.splice(p_newIndex, 0, result.splice(p_oldIndex, 1)[0]);
    return result;
  };
  ArrayUtils.fromMiddleToEnd = function(p_array) {
    var first, last, len, merged, midLen;
    len = p_array.length;
    midLen = Math.floor(len * 0.5);
    first = p_array.slice(midLen, len);
    last = p_array.slice(0, midLen).reverse();
    merged = this.merge(first, last);
    return merged;
  };
  ArrayUtils.fromEndToMiddle = function(p_array) {
    return this.fromMiddleToEnd(p_array).reverse();
  };
  ArrayUtils.lastIndexOf = function(p_array, p_value) {
    var i, index, total;
    i = 0;
    total = p_array.length;
    index = -1;
    while (i !== total) {
      if (p_array[i] === p_value) {
        index = i;
      }
      i++;
    }
    return index;
  };
  return ArrayUtils;
})();
/**
Bunch of utilities methods for String
@class StringUtils
@static
 */
var StringUtils,
  __slice = [].slice;
StringUtils = (function() {
  function StringUtils() {}
  /**
  	Check in a search in the string and returns whether it contains the sentence.
  	@method hasString
  	@static
  	@param {String} p_string The variable to validate.
  	@param {String} p_search The value to search in variable.
  	@return {Boolean}
   */
  StringUtils.hasString = function(p_string, p_search) {
    if (p_string.split(p_search).length !== 1) {
      return true;
    } else {
      return false;
    }
  };
  /**
  	A basic method of replace a sentence in a String.
  	@method replace
  	@static
  	@param {String} p_string The variable to replace.
  	@param {String} p_from - The string to search in variable.
  	@param {String} p_to - The value to replace.
  	@return {String}
   */
  StringUtils.replace = function(p_string, p_from, p_to) {
    return p_string.split(p_from).join(p_to);
  };
  /**
  	A method to revert a content of a String.
  	@method reverse
  	@static
  	@param {String} p_string The variable to reverse.
  	@return {String}
   */
  StringUtils.reverse = function(p_string) {
    if (!p_string) {
      return "";
    }
    return p_string.split("").reverse().join("");
  };
  /**
  	A method to convert the string to camel case
  	@method toCamelCase
  	@static
  	@param {String} p_string - The value to camellcase.
  	@return {String}
   */
  StringUtils.toCamelCase = function(p_string) {
    var re;
    re = p_string.replace(/([\+\-_ ][a-z])/g, function($1) {
      return $1.toUpperCase().replace(/[\+\-_ ]/, "");
    });
    return re.charAt(0).toUpperCase() + re.slice(1);
  };
  /**
  	A method to remove the white spaces in a String.
  	@method removeWhiteSpace
  	@static
  	@param {String} p_string - The value to remove the white spaces.
  	@return {String}
   */
  StringUtils.removeWhiteSpace = function(p_string) {
    if (!p_string) {
      return "";
    }
    return this.trim(p_string).replace(/\s+/g, "");
  };
  /**
  	A method to remove HTML tags in a String.
  	@method removeHTMLTag
  	@static
  	@param {String} p_string - The value to remove the HTML tags.
  	@return {String}
   */
  StringUtils.removeHTMLTag = function(p_string) {
    return p_string.replace(/<.*?>/g, "");
  };
  /**
  	A method to remove special characters in a String.
  	@method removeSpecialChars
  	@static
  	@param {String} p_string The value to remove the special characters.
  	@return {String}
   */
  StringUtils.removeSpecialChars = function(p_string) {
    return p_string.replace(/[^a-zA-Z 0-9]+/g, '');
  };
  /**
  	A method to convert a numeric string to brazillian CPF format. (XXX.XXX.XXX-XX)
  	@method convertToCPF
  	@static
  	@param {String} p_string - The value to format.
  	@return {String}
   */
  StringUtils.convertToCPF = function(p_string) {
    p_string = this.removeSpecialChars(p_string);
    if (p_string.length > 9) {
      p_string = p_string.replace(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/, '$1' + "." + "$2" + "." + "$3" + "-" + "$4");
    } else if (p_string.length > 6) {
      p_string = p_string.replace(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/, '$1' + "." + "$2" + "." + "$3");
    } else if (p_string.length > 3) {
      p_string = p_string.replace(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/, '$1' + "." + "$2");
    } else {
      p_string = p_string.replace(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/, '$1');
    }
    return p_string;
  };
  /**
  	A method to convert a numeric string to brazillian CEP format. (XXXXX-XXX)
  	@method convertToCEP
  	@static
  	@param {String} p_string - The value to format.
  	@return {String}
   */
  StringUtils.convertToCEP = function(p_string) {
    p_string = this.removeSpecialChars(p_string);
    if (p_string.length > 5) {
      p_string = p_string.replace(/(\d{0,5})(\d{0,3})/, '$1' + "-" + "$2");
    } else {
      p_string = p_string.replace(/(\d{0,5})(\d{0,3})/, '$1');
    }
    return p_string;
  };
  /**
  	A method to convert a numeric string to date format. (XX/XX/XXXX)
  	@method convertToDate
  	@static
  	@param {String} p_string - The value to format.
  	@return {String}
   */
  StringUtils.convertToDate = function(p_string) {
    p_string = this.removeSpecialChars(p_string);
    if (p_string.length > 4) {
      p_string = p_string.replace(/(\d{0,2})(\d{0,2})(\d{0,4})/, '$1' + "/" + "$2" + "/" + "$3");
    } else if (p_string.length > 2) {
      p_string = p_string.replace(/(\d{0,2})(\d{0,2})(\d{0,4})/, '$1' + "/" + "$2");
    } else {
      p_string = p_string.replace(/(\d{0,2})(\d{0,2})(\d{0,4})/, '$1');
    }
    return p_string;
  };
  /**
  	A method to check if the String is empty.
  	@method isEmpty
  	@static
  	@param {String} p_string - The value to remove the white spaces.
  	@return {Bollean}
   */
  StringUtils.isEmpty = function(p_string) {
    if (!p_string || p_string === "") {
      return true;
    } else {
      return false;
    }
  };
  /**
  	A method to capitalize case the String
  	@method toCapitalizeCase
  	@static
  	@param {String} p_string - The value to capitalize case.
  	@return {String}
   */
  StringUtils.toCapitalizeCase = function(p_string) {
    var str;
    str = this.trimLeft(p_string);
    return str.replace(/(^\w)/, this._upperCase);
  };
  /**
  	A method to convert milisecounds (Number) in a String on time format.
  	@method toTimeFormat
  	@static
  	@param {Number} p_miliseconds - The number in milisecounds.
  	@param {Bollean} p_decimal - Value if is a decimal format.
  	@return {String}
   */
  StringUtils.toTimeFormat = function(p_miliseconds, p_decimal) {
    var minutes, seconds;
    if (p_decimal == null) {
      p_decimal = true;
    }
    minutes = Math.floor(p_miliseconds / 60);
    seconds = Math.floor(p_miliseconds % 60);
    return String(p_decimal ? this.addDecimalZero(minutes) + ":" + this.addDecimalZero(seconds) : minutes + ":" + seconds);
  };
  /**
  	A method to add a zero before if the p_value is smaller that 10 and bigger that -1.
  	@method addDecimalZero
  	@static
  	@param {Number} p_value
  	@return {String}
   */
  StringUtils.addDecimalZero = function(p_value) {
    if (p_value < 10) {
      return "0" + p_value;
    }
    return String(p_value);
  };
  /**
  	A method to abbreviate a String.
  	@method abbreviate
  	@static
  	@param {String} p_string The text to abbreviate.
  	@param {Number} p_max_length the length to text.
  	@param {String} p_indicator - The value of the end String.
  	@param {String} p_split - The value to before p_indicator and after text.
  	@return {String}
   */
  StringUtils.abbreviate = function(p_string, p_max_length, p_indicator, p_split) {
    var badChars, charCount, n, pieces, result;
    if (p_max_length == null) {
      p_max_length = 50;
    }
    if (p_indicator == null) {
      p_indicator = '...';
    }
    if (p_split == null) {
      p_split = ' ';
    }
    if (!p_string) {
      return "";
    }
    if (p_string.length < p_max_length) {
      return p_string;
    }
    result = '';
    n = 0;
    pieces = p_string.split(p_split);
    charCount = pieces[n].length;
    while (charCount < p_max_length && n < pieces.length) {
      result += pieces[n] + p_split;
      charCount += pieces[++n].length + p_split.length;
    }
    if (n < pieces.length) {
      badChars = ['-', '—', ',', '.', ' ', ':', '?', '!', '', "\n", ' ', String.fromCharCode(10), String.fromCharCode(13)];
      while (badChars.indexOf(result.charAt(result.length - 1)) !== -1) {
        result = result.slice(0, -1);
      }
      result = this.trim(result) + p_indicator;
    }
    if (n === 0) {
      result = p_string.slice(0, p_max_length) + p_indicator;
    }
    return result;
  };
  /**
  	A method to convert a String to Boolean (yes | true | 1 | no | false | 0).
  	@method toBoolean
  	@static
  	@param {String} p_string The value to converting.
  	@return {Boolean}
   */
  StringUtils.toBoolean = function(p_string) {
    var t;
    t = ['yes', 'true', '1', 1, true];
    if (p_string && ArrayUtils.hasItem(p_string, t)) {
      return true;
    }
    return false;
  };
  /**
  	A method to returns a random String with the specified length.
  	@method random
  	@static
  	@param {Number} p_length The length of the random.
  	@return {String}
   */
  StringUtils.random = function(p_length) {
    var i, s, _i;
    if (p_length == null) {
      p_length = 10;
    }
    s = "";
    for (i = _i = p_length; p_length <= 1 ? _i <= 1 : _i >= 1; i = p_length <= 1 ? ++_i : --_i) {
      s += String.fromCharCode(65 + Math.floor(Math.random() * 25));
    }
    return s;
  };
  /**
  	Trim
  	@method trim
  	@static
  	@param {String} p_str
  	@param {String} p_char
  	@return {String}
   */
  StringUtils.trim = function(p_str, p_char) {
    if (p_str === null) {
      return "";
    }
    return this.trimRight(this.trimLeft(p_str, p_char), p_char);
  };
  /**
  	Trim Right
  	@method trimRight
  	@static
  	@param {String} p_str
  	@param {String} p_char
  	@return {String}
   */
  StringUtils.trimRight = function(p_str, p_char) {
    var re;
    if (!p_str) {
      return "";
    }
    re = new RegExp(p_char + '*$');
    re.global = true;
    re.multiline = true;
    return p_str.replace(re, '');
  };
  /**
  	Trim left
  	@method trimLeft
  	@static
  	@param {String} p_str
  	@param {String} p_char
  	@return {String}
   */
  StringUtils.trimLeft = function(p_str, p_char) {
    var re;
    if (!p_str) {
      return "";
    }
    re = new RegExp('^' + p_char + '*');
    re.global = true;
    re.multiline = true;
    return p_str.replace(re, '');
  };
  /**
  	Replace special characters
  	@method replaceSpecialCharacters
  	@static
  	@param {String} p_string
  	@return {String}
   */
  StringUtils.replaceSpecialCharacters = function(p_string) {
    var char, pattern;
    if (!this.substitionDict) {
      this._initDict();
    }
    for (char in this.substitionDict) {
      console.log(char);
      pattern = new RegExp(char, "g");
      p_string = p_string.replace(pattern, this.substitionDict[char]);
    }
    return p_string;
  };
  /**
  	Set strings uppercase
  	@method _upperCase
  	@private
  	@param {String} p_char
  	@param {Object} args
  	@return {String}
   */
  StringUtils._upperCase = function() {
    var args, p_char;
    p_char = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return p_char.toUpperCase();
  };
  /**
  	List of space character
  	@property substitionDict
  	@type {Array}
  	@private
  	@return {String}
   */
  StringUtils.substitionDict = null;
  /**
  	Create list of space character
  	@property _initDict
  	@private
  	@type {Array}
  	@return {Array}
   */
  StringUtils._initDict = function() {
    var char, _results;
    this.substitionDict = [];
    this.substitionDict["ã"] = "a";
    this.substitionDict["á"] = "a";
    this.substitionDict["â"] = "a";
    this.substitionDict["ä"] = "a";
    this.substitionDict["à"] = "a";
    this.substitionDict["é"] = "e";
    this.substitionDict["ê"] = "e";
    this.substitionDict["ë"] = "e";
    this.substitionDict["è"] = "e";
    this.substitionDict["í"] = "i";
    this.substitionDict["î"] = "i";
    this.substitionDict["ï"] = "i";
    this.substitionDict["ì"] = "i";
    this.substitionDict["õ"] = "o";
    this.substitionDict["ó"] = "o";
    this.substitionDict["ô"] = "o";
    this.substitionDict["ö"] = "o";
    this.substitionDict["ò"] = "o";
    this.substitionDict["ú"] = "u";
    this.substitionDict["û"] = "u";
    this.substitionDict["ü"] = "u";
    this.substitionDict["ù"] = "u";
    this.substitionDict["ç"] = "c";
    this.substitionDict["ñ"] = "n";
    _results = [];
    for (char in this.substitionDict) {
      _results.push(this.substitionDict[char.toUpperCase()] = String(this.substitionDict[char]).toUpperCase());
    }
    return _results;
  };
  return StringUtils;
})();
(function() {
  'use strict';
  var CacheControllerPlugin, s;
  CacheControllerPlugin = function() {};
  s = CacheControllerPlugin;
  s.getPreloadHandlers = function() {
    return {
      callback: s.preloadHandler,
      types: ["binary", "image", "javascript", "json", "jsonp", "sound", "video", "svg", "text", "xml"]
    };
  };
  s.preloadHandler = function(p_loadItem, p_queue) {
    var cache, cv, parentView, ts, view, views, _ref;
    views = typeof app !== "undefined" && app !== null ? (_ref = app.config) != null ? _ref.views : void 0 : void 0;
    view = views != null ? views[p_queue.id] : void 0;
    parentView = views != null ? views[view != null ? view.parentView : void 0] : void 0;
    cv = false;
    if (p_loadItem.cache != null) {
      if (p_loadItem.cache === false) {
        cv = true;
      }
    } else if ((view != null ? view.cache : void 0) != null) {
      if ((view != null ? view.cache : void 0) === false) {
        cv = true;
      }
    } else if ((parentView != null ? parentView.cache : void 0) != null) {
      if ((parentView != null ? parentView.cache : void 0) === false) {
        cv = true;
      }
    }
    if (p_loadItem.src.indexOf("?v=") === -1) {
      ts = new Date().getTime();
      cache = cv ? "?v=" + app.info.version + "&noCache=" + ts : "?v=" + app.info.version;
      p_loadItem.src += cache;
    }
    return true;
  };
  createjs.CacheControllerPlugin = CacheControllerPlugin;
})();
this.createjs = this.createjs || {};
(function() {
  var MediaRequest, p, s;
  MediaRequest = function(loadItem, tag, srcAttribute) {
    this.fullBuffer = loadItem.fullBuffer;
    this.AbstractRequest_constructor(loadItem);
    this._tag = tag;
    this._tagSrcAttribute = srcAttribute;
    this._complete = createjs.proxy(this._handleTagComplete, this);
  };
  'use strict';
  p = createjs.extend(MediaRequest, createjs.TagRequest);
  s = MediaRequest;
  p.load = function() {
    var _error, _progress, _stalled, _timeout;
    _progress = createjs.proxy(this._handleProgress, this);
    this._handleProgress = _progress;
    _stalled = createjs.proxy(this._handleStalled, this);
    this._handleStalled = _stalled;
    _error = createjs.proxy(this._handleError, this);
    this._handleError = _error;
    _timeout = createjs.proxy(this._handleTimeout, this);
    this._handleTimeout = _timeout;
    this.____timer = setInterval(_progress, 10);
    if (this._tag.addEventListener) {
      this._tag.addEventListener('progress', _progress);
      this._tag.addEventListener('stalled', _stalled);
      this._tag.addEventListener('error', _error);
    } else {
      this._tag.onprogress = _progress;
      this._tag.onstalled = _stalled;
      this._tag.onerror = _error;
    }
    if (this.fullBuffer || this.fullBuffer === void 0) {
      if (this._tag.addEventListener) {
        this._tag.addEventListener('ended', this._complete, false);
        this._tag.addEventListener('complete', this._complete, false);
      } else {
        this._tag.onended = this._tag.oncomplete = this._complete;
      }
    } else {
      if (this._tag.addEventListener) {
        this._tag.addEventListener('canplaythrough', this._complete, false);
      } else {
        this._tag.oncanplaythrough = this._complete;
      }
    }
    this.TagRequest_load();
  };
  p._handleTimeout = function() {};
  p._handleStalled = function() {};
  p._handleError = function(evt) {
    var err;
    try {
      console.log(evt.data);
      throw new Error(evt.title);
    } catch (_error) {
      err = _error;
      return console.log(err.stack);
    }
  };
  p._handleProgress = function() {
    var err, loaded, total;
    try {
      loaded = this._tag.buffered.end(this._tag.buffered.length - 1);
      total = this._tag.duration;
      this._tag.currentTime = loaded;
      this.dispatchEvent(new createjs.ProgressEvent(loaded, total));
    } catch (_error) {
      err = _error;
    }
    if (Math.round(loaded) >= Math.round(total)) {
      this._complete();
    }
  };
  p.destroy = function() {
    this.TagRequest_destroy();
  };
  p._handleTagComplete = function() {
    this.TagRequest__handleTagComplete();
  };
  p._clean = function() {
    var err, loaded, total, _ref;
    try {
      loaded = this._tag.buffered.end(this._tag.buffered.length - 1);
      total = this._tag.duration;
    } catch (_error) {
      err = _error;
    }
    if (Math.round(loaded) >= Math.round(total)) {
      clearInterval(this.____timer);
      this.____timer = null;
      if (this._tag.removeEventListener) {
        this._tag.removeEventListener('progress', this._handleProgress);
        this._tag.removeEventListener('stalled', this._handleStalled);
        this._tag.removeEventListener('error', this._handleError);
        this._tag.removeEventListener('ended', this._complete);
        this._tag.removeEventListener('complete', this._complete);
        this._tag.removeEventListener('canplaythrough', this._complete);
      } else {
        this._tag.onended = null;
        this._tag.oncanplaythrough = null;
        this._tag.onprogress = null;
        this._tag.onstalled = null;
        this._tag.onerror = null;
      }
      if ((_ref = this._tag) != null) {
        _ref.currentTime = 0.0001;
      }
      this.TagRequest__clean();
    }
  };
  createjs.MediaRequest = createjs.promote(MediaRequest, 'TagRequest');
})();
this.createjs = this.createjs || {};
(function() {
  var TagMediaLoader, p;
  TagMediaLoader = function(loadItem, preferXHR, type) {
    this.AbstractLoader_constructor(loadItem, preferXHR, type);
    this.resultFormatter = this._formatResult;
    this._tagSrcAttribute = 'src';
  };
  'use strict';
  p = createjs.extend(TagMediaLoader, createjs.AbstractLoader);
  p.load = function() {
    if (!this._tag) {
      this._tag = this._createTag(this._item.src);
    }
    this._tag.preload = 'auto';
    this._tag.load();
    this.AbstractLoader_load();
  };
  p._createTag = function() {};
  p._createRequest = function() {
    this._request = new createjs.MediaRequest(this._item, this._tag || this._createTag(), this._tagSrcAttribute);
  };
  p._formatResult = function(loader) {
    this._tag.removeEventListener && this._tag.removeEventListener('complete', this._loadedHandler);
    this._tag.removeEventListener && this._tag.removeEventListener('canplaythrough', this._loadedHandler);
    this._tag.onstalled = null;
    if (this._preferXHR) {
      loader.getTag().src = loader.getResult(true);
    }
    return loader.getTag();
  };
  createjs.TagMediaLoader = createjs.promote(TagMediaLoader, 'AbstractLoader');
})();
this.createjs = this.createjs || {};
(function() {
  var MediaLoader, p, s;
  MediaLoader = function(loadItem, preferXHR) {
    this.___item = loadItem;
    if (loadItem.type === "video") {
      this.TagMediaLoader_constructor(loadItem, preferXHR, createjs.AbstractLoader.VIDEO);
      if (createjs.RequestUtils.isVideoTag(loadItem) || createjs.RequestUtils.isVideoTag(loadItem.src)) {
        this.setTag(createjs.RequestUtils.isVideoTag(loadItem) ? loadItem : loadItem.src);
        this._preferXHR = false;
      } else {
        this.setTag(this._createTag());
      }
    } else {
      this.TagMediaLoader_constructor(loadItem, preferXHR, createjs.AbstractLoader.SOUND);
      if (createjs.RequestUtils.isAudioTag(loadItem)) {
        this._tag = loadItem;
      } else if (createjs.RequestUtils.isAudioTag(loadItem.src)) {
        this._tag = loadItem;
      } else if (createjs.RequestUtils.isAudioTag(loadItem.tag)) {
        this._tag = createjs.RequestUtils.isAudioTag(loadItem) ? loadItem : loadItem.src;
      }
      if (this._tag !== null) {
        this._preferXHR = false;
      }
    }
  };
  'use strict';
  s = MediaLoader;
  p = createjs.extend(MediaLoader, createjs.TagMediaLoader);
  p._createTag = function(src) {
    var tag;
    if (this.___item.type === 'video') {
      tag = document.createElement('video');
      tag.type = "video/mp4";
      tag.preload = 'auto';
    } else {
      tag = document.createElement('audio');
      tag.type = "audio/mpeg";
      tag.preload = 'auto';
      tag.src = src;
    }
    if (this.___item.id != null) {
      tag.id = this.___item.id;
    }
    if (!this.___item.autoplay || this.___item.autoplay === void 0) {
      tag.autoplay = false;
    } else {
      tag.autoplay = this.___item.autoplay;
    }
    if (!this.___item.loop || this.___item.loop === void 0) {
      tag.loop = false;
    } else {
      tag.loop = this.___item.loop;
    }
    if (!this.___item.volume || this.___item.volume === void 0) {
      tag.volume = 1;
    } else {
      tag.volume = this.___item.volume;
    }
    return tag;
  };
  s.canLoadItem = function(item) {
    if (this.___item.type === 'video') {
      return item.type === createjs.AbstractLoader.VIDEO;
    } else {
      return item.type === createjs.AbstractLoader.SOUND;
    }
  };
  createjs.MediaLoader = createjs.promote(MediaLoader, 'TagMediaLoader');
})();
(function() {
  'use strict';
  var MediaPlugin, s;
  MediaPlugin = function() {};
  s = MediaPlugin;
  s.getPreloadHandlers = function() {
    return {
      callback: s.handlers,
      types: ['sound', 'video'],
      extensions: ['mp3', 'mp4']
    };
  };
  s.handlers = function(p_loadItem, p_queue) {
    var cache, cv, loader, parentView, ts, view, views, _ref;
    views = typeof app !== "undefined" && app !== null ? (_ref = app.config) != null ? _ref.views : void 0 : void 0;
    view = views != null ? views[p_queue.id] : void 0;
    parentView = views != null ? views[view != null ? view.parentView : void 0] : void 0;
    cv = false;
    if (p_loadItem.cache != null) {
      if (p_loadItem.cache === false) {
        cv = true;
      }
    } else if ((view != null ? view.cache : void 0) != null) {
      if ((view != null ? view.cache : void 0) === false) {
        cv = true;
      }
    } else if ((parentView != null ? parentView.cache : void 0) != null) {
      if ((parentView != null ? parentView.cache : void 0) === false) {
        cv = true;
      }
    }
    if (p_loadItem.src.indexOf("?v=") === -1) {
      ts = new Date().getTime();
      cache = cv ? "?v=" + app.info.version + "&noCache=" + ts : "?v=" + app.info.version;
      p_loadItem.src += cache;
    }
    loader = new createjs.MediaLoader(p_loadItem, false);
    return loader;
  };
  createjs.MediaPlugin = MediaPlugin;
})();
/**
EventDispatcher class for handling and triggering events.
@class EventDispatcher
 */
var EventDispatcher;
EventDispatcher = (function() {
  function EventDispatcher() {
    this._triggerStacked = __bind(this._triggerStacked, this);
    this.trigger = __bind(this.trigger, this);
  }
  EventDispatcher.prototype._events = null;
  /**
  	Add a event listener.
  	@method on
  	@param {String} event Event name.
  	@param {function} handler A callback function to handle the event.<br>
  	The callback function can receive 1 or 2 parameters. The first parameter is the event data itself and the second parameter is the custom data of the triggering event.
  	@example
  		function someEventHandler(e, data)
  		{
  			console.log(e); // Returns event data with it's type and target/currentTarget set to the scope
  			console.log(data); // If the triggering event has any custom data
  		}
  		var ed = new EventDispatcher()
  		ed.on('someEvent', someEventHandler);
   */
  EventDispatcher.prototype.on = function(p_event, p_handler) {
    if (!this._events) {
      this._events = {};
    }
    if (!this._events[p_event]) {
      this._events[p_event] = [];
    }
    if (!(__indexOf.call(this._events[p_event], p_handler) >= 0)) {
      return this._events[p_event].unshift(p_handler);
    }
  };
  /**
  	Remove an event listener.
  	**BEWARE**
  	> Calling this method without a handler will remove all listeners attached to this event.
  	> If calling without the event name, will remove all listeners attached to this instance.
  	@method off
  	@param {String} [event=null] Event name.
  	@param {function} [handler=null]
  	A callback function added in the {{#crossLink "EventDispatcher/on:method"}}{{/crossLink}} call.
   */
  EventDispatcher.prototype.off = function(p_event, p_handler) {
    var events, i;
    if (p_event == null) {
      p_event = null;
    }
    if (p_handler == null) {
      p_handler = null;
    }
    if (!this._events) {
      this._events = {};
      return;
    }
    if ((p_event != null) && Boolean(this._events[p_event])) {
      events = this._events[p_event];
      if (!p_handler) {
        return this._events[p_event].length = 0;
      } else {
        while ((i = events.indexOf(p_handler)) >= 0) {
          events.splice(i, 1);
        }
        return this._events[p_event] = events;
      }
    } else {
      return this._events = {};
    }
  };
  /**
  	Triggers an event.
  	@method trigger
  	@param {String} event Event name.
  	@param {object} [data=null] Custom event data.
  	@param {object} [target=null] Target that will be specified in the `event.target`. The `event.currentTarget` will always be this instance.
  	@example
  		var ed = new EventDispatcher()
  		// Will just trigger the event
  		ed.trigger('someEvent'); 
  		// Will trigger the event with the object which can be retrieved by the second
  		// parameter of the handler function.
  		ed.trigger('someEvent', {someData: true}); 
  		// Will set the event target to window. On the handler's first parameter
  		//`event.target` will be window, and event.currentTarget will be the `ev` instance.
  		ed.trigger('someEvent', {someData: true}, window);
   */
  EventDispatcher.prototype.trigger = function(evt, data, target) {
    var e, events, i, k, v, _i, _len, _results;
    if (data == null) {
      data = null;
    }
    if (target == null) {
      target = null;
    }
    if (Array.isArray(evt)) {
      for (_i = 0, _len = evt.length; _i < _len; _i++) {
        e = evt[_i];
        this.trigger(evt, data);
      }
      return;
    }
    if (!this._events) {
      this._events = {};
    }
    events = this._events[evt];
    if (!events || events.length === 0) {
      return;
    }
    if (!target) {
      target = this;
    }
    e = {
      type: evt,
      target: target,
      currentTarget: this
    };
    if (typeof data === 'object') {
      for (k in data) {
        v = data[k];
        if (!e[k]) {
          e[k] = v;
        }
      }
    }
    i = events.length;
    _results = [];
    while (i-- > 0) {
      _results.push(typeof events[i] === "function" ? events[i](e, data) : void 0);
    }
    return _results;
  };
  /**
  	Check if a event handler is already set.
  	@method hasEvent
  	@param {String} event Event name.
  	@param {function} [handler=null] A callback function added in the {{#crossLink "EventDispatcher/on:method"}}{{/crossLink}} call.
  	@return {Boolean}
   */
  EventDispatcher.prototype.hasEvent = function(p_event, p_handler) {
    var event;
    if (!this._events) {
      this._events = {};
      return;
    }
    for (event in this._events) {
      if (event === p_event) {
        if (this._events[event].indexOf(p_handler) > -1) {
          return true;
        }
      }
    }
    return false;
  };
  /**
  	Triggers an event after the current code block has finished processing.
  	This is useful for stacking up events that needs to be triggered at the end of the function but it's validating beforehand.
  	@method stackTrigger
  	@param {String} event Event name.
  	@param {object} [data=null] Custom event data.
  	@param {object} [target=null] Target that will be specified in the `event.target`. The `event.currentTarget` will always be this instance.
  	@example
  		var ed = new EventDispatcher()
  		var someObject = {a: true, b: false, c: true};
  		ed.on('isA', function(){console.log('Is A!');});
  		ed.on('isB', function(){console.log('Is B!');});
  		ed.on('isC', function(){console.log('Is C!');});
  		function test()
  		{
  			console.log("Init test()");
  			if(someObject.a) ed.stackTrigger('isA');
  			if(someObject.b) ed.stackTrigger('isB');
  			if(someObject.c) ed.stackTrigger('isC');
  			console.log("End test()");
  		}
  		// This will result in:
  		// log: 'Init test()'
  		// log: 'End test()'
  		// log: 'isA'
  		// log: 'isC'
   */
  EventDispatcher.prototype.stackTrigger = function(evt, data, target) {
    if (data == null) {
      data = null;
    }
    if (target == null) {
      target = null;
    }
    if (!this._stackTriggerer) {
      this._stackTriggerer = [];
    }
    this._stackTriggerer.push([evt, data, target]);
    clearTimeout(this._stackTriggerTimeout);
    return this._stackTriggerTimeout = setTimeout(this._triggerStacked, 0);
  };
  EventDispatcher.prototype._triggerStacked = function() {
    var i, l;
    l = this._stackTriggerer.length;
    i = -1;
    while (++i < l) {
      this.trigger.apply(this, this._stackTriggerer[i]);
    }
    return this._stackTriggerer.length = 0;
  };
  return EventDispatcher;
})();
var PathsData;
PathsData = (function(_super) {
  var _data;
  __extends(PathsData, _super);
  _data = null;
  PathsData.getInstance = function(p_value) {
    return PathsData._instance != null ? PathsData._instance : PathsData._instance = new PathsData(p_value);
  };
  function PathsData(p_value) {
    this._parseVars = __bind(this._parseVars, this);
    this._parseData = __bind(this._parseData, this);
    this.translate = __bind(this.translate, this);
    if (this.data == null) {
      this.data = p_value;
    }
    PathsData.__super__.constructor.apply(this, arguments);
  }
  PathsData.get({
    data: function() {
      return _data;
    }
  });
  PathsData.set({
    data: function(p_value) {
      return _data = this._parseData(p_value);
    }
  });
  /**
  	@method translate
  	@param {Object} p_source
  	@return {String}
   */
  PathsData.prototype.translate = function(p_source) {
    return this._parseVars(p_source);
  };
  /**
  	@static
  	@method translate
  	@param {Object} p_value
  	@param {Object} p_collection
  	@return {String}
   */
  PathsData.translate = function(p_value, p_collection) {
    return PathsData._parseVars(p_value, PathsData._parseData(p_collection));
  };
  /**
  	@method _parseData
  	@param {Object} p_vars
  	@return {Object}
  	@private
   */
  PathsData.prototype._parseData = function(p_vars) {
    var o, p_varsStr, val;
    p_varsStr = JSON.stringify(p_vars);
    while ((o = /\{([^\"\{\}]+)\}/.exec(p_varsStr))) {
      val = p_vars[o[1]];
      if (!val) {
        val = '';
      }
      p_varsStr = p_varsStr.replace(new RegExp('\{' + o[1] + '\}', 'ig'), val);
      p_vars = JSON.parse(p_varsStr);
    }
    return p_vars;
  };
  /**
  	@method _parseVars
  	@param {Object} p_data
  	@param {Object} p_vars
  	@return {String}
  	@private
   */
  PathsData.prototype._parseVars = function(p_vars) {
    var k, v;
    for (k in _data) {
      v = _data[k];
      p_vars = JSON.stringify(p_vars);
      p_vars = p_vars.replace(new RegExp('\{' + k + '\}', 'ig'), v);
      p_vars = JSON.parse(p_vars);
    }
    return p_vars;
  };
  return PathsData;
})(EventDispatcher);
var ObjectUtils;
ObjectUtils = (function() {
  function ObjectUtils() {}
  /**
  	Return the length of a item.
  	@method count
  	@static
  	@param {Object} p_item object to count.
  	@return {Number}
   */
  ObjectUtils.count = function(p_item) {
    var err, key, result;
    result = 0;
    try {
      result = Object.keys(p_item).length;
    } catch (_error) {
      err = _error;
      for (key in p_item) {
        result++;
      }
    }
    return result;
  };
  ObjectUtils.toArray = function(p_source) {
    var k, result, v;
    result = [];
    for (k in p_source) {
      v = p_source[k];
      result.push(p_source[k]);
    }
    return result;
  };
  ObjectUtils.merge = function(a, b) {
    var k;
    if (typeof a === 'object' && typeof b === 'object') {
      for (k in b) {
        if (!a.hasOwnProperty(k)) {
          a[k] = b[k];
        }
      }
    }
    return a;
  };
  ObjectUtils.clone = function(p_target) {
    var copy, err, i, k, len, v;
    try {
      if (!p_target || typeof p_target !== 'object') {
        return p_target;
      }
      copy = null;
      if (p_target instanceof Array) {
        copy = [];
        i = 0;
        len = p_target.length;
        while (i < len) {
          copy[i] = this.clone(p_target[i]);
          i++;
        }
        return copy;
      }
      if (p_target instanceof Object) {
        copy = {};
        for (k in p_target) {
          v = p_target[k];
          if (v !== 'object') {
            copy[k] = v;
          } else {
            copy[k] = this.clone(v);
          }
        }
        return copy;
      }
    } catch (_error) {
      err = _error;
      return JSON.parse(JSON.stringify(p_target));
    }
  };
  ObjectUtils.replaceValue = function(p_obj, p_value, p_newvalue, p_clone) {
    var k, resp, v;
    if (p_clone == null) {
      p_clone = true;
    }
    resp = [];
    for (k in p_obj) {
      v = p_obj[k];
      if (v === p_value) {
        p_obj[k] = p_newvalue;
        resp.push(p_obj);
      }
      if (typeof v === 'object') {
        resp = [].concat(resp, ObjectUtils.replaceValue(v, p_value, p_newvalue, p_clone));
      }
    }
    return resp;
  };
  ObjectUtils.hasSameKey = function(p_a, p_b) {
    if (Object.getOwnPropertyNames(p_a)[0] === Object.getOwnPropertyNames(p_b)[0]) {
      return true;
    } else {
      return false;
    }
  };
  ObjectUtils.isEqual = function(p_a, p_b) {
    return JSON.stringify(p_a) === JSON.stringify(p_b);
  };
  ObjectUtils.parseLinkedArray = function(p_source) {
    var i, item, j, names, numNames, o, ret;
    if (!p_source || (p_source && p_source.length < 1)) {
      return [];
    }
    i = p_source.length;
    names = p_source[0];
    numNames = names.length;
    ret = [];
    while (i-- > 1) {
      o = {};
      j = numNames;
      item = p_source[i];
      while (j-- > 0) {
        o[names[j]] = item[j];
      }
      ret[i - 1] = o;
    }
    return ret;
  };
  return ObjectUtils;
})();
var JSONUtils;
JSONUtils = (function() {
  function JSONUtils() {}
  JSONUtils.parseJSON = function(json) {
    var stringfied;
    stringfied = false;
    if (typeof json === 'string') {
      stringfied = true;
      json = JSONUtils.replaceMultiline(json);
    }
    json = JSONUtils.removeComments(json);
    if (stringfied) {
      json = JSON.parse(json);
    }
    return json;
  };
  JSONUtils.replaceMultiline = function(json) {
    if (typeof json !== 'string') {
      return json;
    }
    json = json.replace(/^(\s*.*?""")(?:[\s\t]*\n)?([\t\s]*)(\S[\s\S]*)\n?[\s]*(""")/igm, this._replaceMultilinePart);
    json = json.replace(/^(\s*.*?)"""([\s\S]*?)"""/igm, this._replaceEmptyMultiline);
    return json;
  };
  JSONUtils._replaceMultilinePart = function(match, prefix, spaces, value, suffix) {
    var re;
    re = new RegExp(spaces + '?([^\n]*)', 'g');
    value = value.replace(re, '$1');
    return prefix + value + suffix;
  };
  JSONUtils._replaceEmptyMultiline = function(match, prefix, value) {
    value = value.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
    return prefix + '"' + value + '"';
  };
  JSONUtils.removeComments = function(json) {
    var stringfied;
    stringfied = true;
    if (typeof json !== 'string') {
      stringfied = false;
      json = JSON.stringify(json);
    }
    json = json.replace(/(^|\s)(\/\/.*$)|(\/\*(.|\s)*?\*\/?)/igm, '');
    if (stringfied) {
      return json;
    } else {
      return JSON.parse(json);
    }
  };
  JSONUtils.filterObject = function(data, name, type, ignore, getParent, p_currentPath) {
    var add, k, objectPath, resp, v;
    if (type == null) {
      type = null;
    }
    if (ignore == null) {
      ignore = null;
    }
    if (getParent == null) {
      getParent = false;
    }
    if (p_currentPath == null) {
      p_currentPath = [];
    }
    resp = [];
    name = [].concat(name);
    if (ignore) {
      ignore = [].concat(ignore);
    }
    for (k in data) {
      v = data[k];
      objectPath = [].concat(p_currentPath, k);
      if (ignore) {
        if (ignore.indexOf(k) >= 0) {
          continue;
        }
      }
      if (name.indexOf(k) >= 0) {
        add = true;
        if (type) {
          if (typeof v !== type) {
            add = false;
          }
        }
        if (add) {
          if (getParent) {
            if (resp.indexOf(data) < 0) {
              data.___path = objectPath.splice(0, objectPath.length - 1);
              resp.push(data);
            }
          } else {
            v.___path = objectPath;
            resp.push(v);
          }
        }
      }
      if (typeof v === 'array' || typeof v === 'object') {
        resp = [].concat(resp, this.filterObject(v, name, type, ignore, getParent, objectPath));
      }
    }
    return resp;
  };
  return JSONUtils;
})();
var AssetLoader;
AssetLoader = (function(_super) {
  __extends(AssetLoader, _super);
  AssetLoader.INITIALIZE = "initialize";
  AssetLoader.COMPLETE_ALL = "complete";
  AssetLoader.COMPLETE_FILE = "fileload";
  AssetLoader.PROGRESS_ALL = "progress";
  AssetLoader.PROGRESS_FILE = "fileprogress";
  AssetLoader.START_ALL = "loadstart";
  AssetLoader.START_FILE = "filestart";
  AssetLoader.ERROR = "error";
  AssetLoader.FILE_ERROR = "fileerror";
  AssetLoader.prototype._groups = null;
  AssetLoader.getInstance = function() {
    return AssetLoader._instance != null ? AssetLoader._instance : AssetLoader._instance = (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })(AssetLoader, arguments, function(){});
  };
  function AssetLoader() {
    this._fileLoad = __bind(this._fileLoad, this);
    this._onFileError = __bind(this._onFileError, this);
    this._onError = __bind(this._onError, this);
    this._onStartFile = __bind(this._onStartFile, this);
    this._groups = {};
  }
  AssetLoader.prototype.loadGroup = function(p_groupId, p_files) {
    var group;
    group = this.getGroup(p_groupId);
    group.loadManifest(p_files);
    return group;
  };
  AssetLoader.prototype.getAllGroups = function() {
    return this._groups;
  };
  AssetLoader.prototype.getGroup = function(p_groupId, p_concurrent, p_xhr) {
    var group;
    if (p_concurrent == null) {
      p_concurrent = 3;
    }
    if (p_xhr == null) {
      p_xhr = true;
    }
    group = this._groups[p_groupId];
    if (!group) {
      group = new createjs.LoadQueue(p_xhr);
      group.installPlugin(createjs.CacheControllerPlugin);
      group.installPlugin(createjs.MediaPlugin);
      group.id = p_groupId;
      this._groups[p_groupId] = group;
      group.on(AssetLoader.ERROR, this._onError);
      group.on(AssetLoader.START_FILE, this._onStartFile);
      group.on(AssetLoader.FILE_ERROR, this._onFileError);
      group.on(AssetLoader.COMPLETE_FILE, this._fileLoad);
    }
    group.setMaxConnections(p_concurrent);
    return group;
  };
  AssetLoader.prototype.preferXHR = function(p_groupId, p_value) {
    var group;
    if (p_value == null) {
      p_value = true;
    }
    group = this.getGroup(p_groupId).setPreferXHR = p_value;
    return group;
  };
  AssetLoader.prototype._onStartFile = function(evt) {
    return evt.item.loaded = false;
  };
  AssetLoader.prototype._onError = function(e) {
    var msg, _ref;
    e.currentTarget.off(AssetLoader.START_FILE, this._onStartFile);
    e.currentTarget.off(AssetLoader.ERROR, this._onError);
    e.currentTarget.off(AssetLoader.COMPLETE_FILE, this._fileLoad);
    msg = e.title;
    if ((e != null ? (_ref = e.data) != null ? _ref.src : void 0 : void 0) != null) {
      e.fileName = e.data.src;
      msg += " " + e.data.src;
    }
    throw new Error(msg).stack;
    return false;
  };
  AssetLoader.prototype._onFileError = function(e) {
    e.currentTarget.off(AssetLoader.START_FILE, this._onStartFile);
    e.currentTarget.off(AssetLoader.FILE_ERROR, this._onFileError);
    e.currentTarget.off(AssetLoader.COMPLETE_FILE, this._fileLoad);
    console.log(e);
    throw new Error(e.title).stack;
    return false;
  };
  AssetLoader.prototype._fileLoad = function(evt) {
    var data, paths, result, _ref;
    evt.item.loaded = true;
    evt.currentTarget.off(AssetLoader.ERROR, this._onError);
    evt.currentTarget.off(AssetLoader.FILE_ERROR, this._onFileError);
    evt.item.result = evt.item.tag = evt.result;
    if ((typeof app !== "undefined" && app !== null ? (_ref = app.config) != null ? _ref.paths : void 0 : void 0) != null) {
      paths = PathsData.getInstance(app.config.paths);
      switch (evt.item.ext) {
        case 'json':
          data = paths.translate(evt.result);
          if (typeof data !== 'string') {
            data = JSON.stringify(data);
          }
          JSONUtils.removeComments(data);
          result = data;
          evt.item.result = evt.item.tag = evt.result = JSON.parse(result);
          break;
        case 'js':
          data = evt.result;
          data = data.replace(/^\/\/.*?(\n|$)/igm, '');
          result = eval('(function (){' + data + '}).call(self)');
          break;
        default:
          result = evt.item;
      }
    }
    return false;
  };
  AssetLoader.prototype.getItem = function(p_id, p_groupId) {
    var i, k, v, _ref, _ref1;
    if (p_groupId == null) {
      p_groupId = null;
    }
    if (p_groupId) {
      return (_ref = this._groups[p_groupId]) != null ? _ref.getItem(p_id) : void 0;
    }
    _ref1 = this._groups;
    for (k in _ref1) {
      v = _ref1[k];
      if (i = v.getItem(p_id)) {
        return i;
      }
    }
  };
  AssetLoader.prototype.getResult = function(p_id, p_groupId) {
    var i, k, result, v, _ref, _ref1;
    if (p_groupId == null) {
      p_groupId = null;
    }
    result = null;
    if (p_groupId) {
      result = (_ref = this._groups[p_groupId]) != null ? _ref.getResult(p_id) : void 0;
    }
    _ref1 = this._groups;
    for (k in _ref1) {
      v = _ref1[k];
      if (i = v.getResult(p_id)) {
        result = i;
      }
    }
    return result;
  };
  return AssetLoader;
})(EventDispatcher);
var ParseData;
ParseData = (function(_super) {
  var _conditions;
  __extends(ParseData, _super);
  _conditions = null;
  function ParseData(p_data) {
    this._data = p_data;
    if (_conditions == null) {
      _conditions = ConditionsValidation.getInstance(this._data.conditions);
    }
    ParseData.__super__.constructor.apply(this, arguments);
  }
  ParseData.get({
    data: function() {
      return this._data;
    }
  });
  ParseData.set({
    data: function(p_value) {
      return this._data = p_value;
    }
  });
  /**
  	@method getPath
  	@param {Object} p_obj
  	@return {String}
  	@static
   */
  ParseData.getPath = function(p_obj) {
    var clone, i, _i, _ref;
    if (p_obj == null) {
      throw new Error('The param p_obj cannot be null');
    }
    if (typeof p_obj === 'object') {
      clone = ObjectUtils.clone(p_obj);
      for (i = _i = 0, _ref = clone.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        if (clone[i].condition != null) {
          if (_conditions != null ? typeof _conditions.test === "function" ? _conditions.test(clone[i].condition) : void 0 : void 0) {
            if (clone[i].file != null) {
              return clone[i].file;
            }
            break;
          }
        } else {
          if (clone[i].file != null) {
            return clone[i].file;
            break;
          }
        }
      }
    }
    return p_obj;
  };
  /**
  	@method getProperties
  	@param {Object} p_obj
  	@return {String}
  	@static
   */
  ParseData.getProperties = function(p_obj) {
    var clone, i, prop, result, value, _i, _ref, _ref1;
    if (p_obj == null) {
      throw new Error('The param p_obj cannot be null');
    }
    result = {};
    if (typeof p_obj === 'object') {
      clone = ObjectUtils.clone(p_obj);
      for (i = _i = 0, _ref = clone.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _ref1 = clone[i];
        for (prop in _ref1) {
          value = _ref1[prop];
          if (prop !== 'condition' && prop !== 'file') {
            result[prop] = value;
          }
        }
      }
    }
    return result;
  };
  /**
  	@method getProperties
  	@param {Object} p_obj
  	@return {String}
  	@protected
   */
  ParseData.prototype.getProperties = function(p_obj) {
    return ParseData.getProperties(p_obj);
  };
  /**
  	@method getPath
  	@param {Object} p_obj
  	@return {String}
  	@protected
   */
  ParseData.prototype.getPath = function(p_obj) {
    return ParseData.getPath(p_obj);
  };
  return ParseData;
})(EventDispatcher);
var ParseConfig;
ParseConfig = (function(_super) {
  var removeParam, _contents, _required, _views;
  __extends(ParseConfig, _super);
  _views = null;
  _contents = null;
  _required = null;
  function ParseConfig(p_data) {
    ParseConfig.__super__.constructor.call(this, p_data);
    if (_contents == null) {
      _contents = [];
    }
    if (_views == null) {
      _views = this._setViews();
    }
    if (_required == null) {
      _required = this._setRequired();
    }
  }
  ParseConfig.get({
    views: function() {
      return _views;
    }
  });
  ParseConfig.get({
    contents: function() {
      return _contents;
    }
  });
  ParseConfig.get({
    required: function() {
      return _required;
    }
  });
  /**
  	@method _setViews
  	@return {Object}
  	@private
   */
  ParseConfig.prototype._setViews = function() {
    var k, p, props, pv, results, v, _ref, _ref1;
    results = [];
    _ref = this.data.views;
    for (k in _ref) {
      v = _ref[k];
      v["class"] = StringUtils.toCamelCase(v["class"]);
      if (v.content) {
        props = this.getProperties(v.content);
        v.content = this.getPath(v.content);
        if (props != null) {
          for (p in props) {
            pv = props[p];
            v[p] = pv;
          }
        }
        _contents.push(this._contentGroup(v));
      }
      results[v.id] = v;
    }
    _ref1 = this.data.views;
    for (k in _ref1) {
      v = _ref1[k];
      if (v.parentView === v.id) {
        throw new Error('The parent view cannot be herself');
      }
      if ((results[v.parentView] != null) && v.parentView !== v.id) {
        if (!results[v.parentView].subviews) {
          results[v.parentView].subviews = {};
        }
        if (v.loadContent === void 0) {
          v.loadContent = results[v.parentView].loadContent != null ? results[v.parentView].loadContent : true;
        } else {
          v.loadContent = v.loadContent;
        }
        results[v.parentView].subviews[v.id] = v;
      }
    }
    this.data.views = results;
    return results;
  };
  /**
  	@method _setRequired
  	@return {Object}
  	@private
   */
  ParseConfig.prototype._setRequired = function() {
    var group, id, k, p, props, pv, results, src, v, _ref;
    results = [];
    for (id in this.data.required) {
      group = [];
      _ref = this.data.required[id];
      for (k in _ref) {
        v = _ref[k];
        v.group = id;
        if (v.src) {
          props = this.getProperties(v.src);
          v.src = this.getPath(v.src);
          if (props != null) {
            for (p in props) {
              pv = props[p];
              v[p] = pv;
            }
          }
        }
        if (v.content) {
          props = this.getProperties(v.content);
          v.content = this.getPath(v.content);
          if (props != null) {
            for (p in props) {
              pv = props[p];
              v[p] = pv;
            }
          }
          _contents.push(this._contentGroup(v));
        }
        if ((v.id == null) || v.id === void 0) {
          src = v.src || v.content;
          v.id = removeParam('noCache', src);
          v.id = removeParam('v', src);
        }
        group[v.id] = v;
      }
      results[id] = group;
    }
    this.data.required = results;
    return results;
  };
  /**
  	@method removeParam
  	@param {String} p_param
  	@param {String} p_url
  	@private
   */
  removeParam = function(p_param, p_url) {
    var i, param, params, query, results;
    param = null;
    params = [];
    results = p_url.split('?')[0];
    query = p_url.indexOf('?') !== -1 ? p_url.split('?')[1] : '';
    if (query !== '') {
      params = query.split('&');
      i = params.length - 1;
      while (i >= 0) {
        param = params[i].split('=')[0];
        if (param === p_param) {
          params.splice(i, 1);
        }
        i -= 1;
      }
      if (params.length > 0) {
        results = results + '?' + params.join('&');
      }
    }
    return results;
  };
  /**
  	@method _contentGroup
  	@param {Object} p_data
  	@return {Array}
  	@private
   */
  ParseConfig.prototype._contentGroup = function(p_data) {
    var result;
    result = {};
    if (p_data.id) {
      result.id = p_data.id;
    }
    if (p_data.group) {
      result.group = p_data.group;
    }
    result.src = this.getPath(p_data.content);
    result.cache = p_data.cache || p_data.cache === void 0 ? true : false;
    result.loadContent = p_data.loadContent || p_data.loadContent === void 0 ? true : false;
    return result;
  };
  return ParseConfig;
})(ParseData);
var ParseContent;
ParseContent = (function(_super) {
  __extends(ParseContent, _super);
  function ParseContent(p_data) {
    ParseContent.__super__.constructor.call(this, p_data);
    this._validatePaths(this.data);
    this._getContents();
  }
  ParseContent.get({
    initialAssets: function() {
      return this._primary;
    }
  });
  ParseContent.get({
    standByAssets: function() {
      return this._standBy;
    }
  });
  /**
  	@method _getContents
  	@return {Object}
  	@private
   */
  ParseContent.prototype._getContents = function() {
    var assets, k, paths, v;
    if (this._primary == null) {
      this._primary = [];
    }
    if (this._standBy == null) {
      this._standBy = [];
    }
    paths = PathsData.getInstance();
    assets = JSONUtils.filterObject(paths.translate(this.data), 'src', null, null, true);
    for (k in assets) {
      v = assets[k];
      if (v.loadWithView || v.loadWithView === void 0) {
        if (this.data.src !== v.src) {
          this._primary.push(v);
        }
      } else if (v.loadWithView === false) {
        this._standBy.push(v);
      }
    }
    return false;
  };
  /**
  	@method _validatePaths
  	@param {Object} p_data
  	@protected
   */
  ParseContent.prototype._validatePaths = function(p_data) {
    var k, p, props, pv, v, _results;
    _results = [];
    for (k in p_data) {
      v = p_data[k];
      if (k === 'src') {
        props = this.getProperties(p_data[k]);
        p_data[k] = this.getPath(p_data[k]);
        if (props != null) {
          for (p in props) {
            pv = props[p];
            p_data[p] = pv;
          }
        }
      }
      if (typeof p_data[k] === 'object' || typeof p_data[k] === 'array') {
        _results.push(this._validatePaths(p_data[k]));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  return ParseContent;
})(ParseData);
var ServiceWorkerController;
ServiceWorkerController = (function(_super) {
  __extends(ServiceWorkerController, _super);
  ServiceWorkerController["const"]({
    INSTALLING: "serviceworker_controller_installing"
  });
  ServiceWorkerController["const"]({
    INSTALLED: "serviceworker_controller_installed"
  });
  ServiceWorkerController["const"]({
    ACTIVE: "serviceworker_controller_active"
  });
  ServiceWorkerController["const"]({
    CHANGE: "serviceworker_controller_change"
  });
  ServiceWorkerController["const"]({
    ERROR: "serviceworker_controller_error"
  });
  function ServiceWorkerController() {
    this.error = __bind(this.error, this);
    this.change = __bind(this.change, this);
    this.registered = __bind(this.registered, this);
    this.messages = __bind(this.messages, this);
    var scope, src, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
    src = (typeof app !== "undefined" && app !== null ? (_ref = app.config) != null ? (_ref1 = _ref.cache) != null ? _ref1.src : void 0 : void 0 : void 0) != null ? typeof app !== "undefined" && app !== null ? (_ref2 = app.config) != null ? (_ref3 = _ref2.cache) != null ? _ref3.src : void 0 : void 0 : void 0 : null;
    scope = (typeof app !== "undefined" && app !== null ? (_ref4 = app.config) != null ? (_ref5 = _ref4.cache) != null ? _ref5.scope : void 0 : void 0 : void 0) != null ? typeof app !== "undefined" && app !== null ? (_ref6 = app.config) != null ? (_ref7 = _ref6.cache) != null ? _ref7.scope : void 0 : void 0 : void 0 : './';
    if (src != null) {
      navigator.serviceWorker.register(src, {
        scope: scope
      }).then(this.registered)["catch"](this.error);
    }
    ServiceWorkerController.__super__.constructor.apply(this, arguments);
  }
  ServiceWorkerController.prototype.messages = function(evt) {
    return console.log("from worker:", evt.data);
  };
  ServiceWorkerController.prototype.registered = function(evt) {
    var serviceWorker;
    if (evt.installing) {
      serviceWorker = evt.installing;
      this.trigger(ServiceWorkerController.INSTALLING, {
        data: serviceWorker
      });
    } else if (evt.waiting) {
      serviceWorker = evt.waiting;
      this.trigger(ServiceWorkerController.INSTALLED, {
        data: serviceWorker
      });
    } else if (evt.active) {
      serviceWorker = evt.active;
      this.trigger(ServiceWorkerController.ACTIVE, {
        data: serviceWorker
      });
    }
    if (serviceWorker) {
      serviceWorker.postMessage = serviceWorker.webkitPostMessage || serviceWorker.postMessage;
      serviceWorker.postMessage(app.info.version);
      serviceWorker.addEventListener('message', this.messages);
      return serviceWorker.addEventListener('statechange', this.change);
    }
  };
  ServiceWorkerController.prototype.change = function(evt) {
    return this.trigger(ServiceWorkerController.CHANGE, {
      data: evt
    });
  };
  ServiceWorkerController.prototype.error = function(err) {
    console.log('ServiceWorkerController registration failed: ', err);
    return this.trigger(ServiceWorkerController.ERROR, {
      data: err
    });
  };
  return ServiceWorkerController;
})(EventDispatcher);
/**
Base class to setup the configuration file and start loading of dependencies.
@class NavigationLoader
@extends EventDispatcher
 */
var NavigationLoader;
NavigationLoader = (function(_super) {
  var config, currentStep, loaderRatio, loaderStep, loaderSteps, paths, removeParam, totalContentsLoaded;
  __extends(NavigationLoader, _super);
  NavigationLoader["const"]({
    CONFIG_LOADED: "config_loaded"
  });
  NavigationLoader["const"]({
    GROUP_ASSETS_LOADED: "group_assets_loaded"
  });
  NavigationLoader["const"]({
    LOAD_START: "load_start"
  });
  NavigationLoader["const"]({
    LOAD_PROGRESS: "load_progress"
  });
  NavigationLoader["const"]({
    LOAD_COMPLETE: "load_complete"
  });
  NavigationLoader["const"]({
    LOAD_FILE_COMPLETE: "load_file_complete"
  });
  paths = null;
  config = null;
  totalContentsLoaded = null;
  loaderStep = 0;
  loaderRatio = 0;
  loaderSteps = null;
  currentStep = null;
  /**
  	@class NavigationLoader
  	@constructor
  	@param {String} p_configPath Path of the navigation configuration file.
   */
  function NavigationLoader(p_configPath) {
    this.assetsLoaded = __bind(this.assetsLoaded, this);
    this.loadComplete = __bind(this.loadComplete, this);
    this.loadProgress = __bind(this.loadProgress, this);
    this.loadFileComplete = __bind(this.loadFileComplete, this);
    this.initialQueue = __bind(this.initialQueue, this);
    this.contentLoaded = __bind(this.contentLoaded, this);
    this.loadContents = __bind(this.loadContents, this);
    this.configLoaded = __bind(this.configLoaded, this);
    var queue;
    if (!p_configPath) {
      throw new Error('The param p_configPath is null');
    }
    queue = this.loader.getGroup('config');
    queue.on(AssetLoader.COMPLETE_FILE, this.configLoaded);
    queue.loadFile({
      id: 'config',
      cache: true,
      src: p_configPath
    });
    false;
  }
  /**
  	@method loader
  	@return {AssetLoader}
  	@protected
   */
  NavigationLoader.get({
    loader: function() {
      return AssetLoader.getInstance();
    }
  });
  /**
  	@method configLoaded
  	@param {Event} evt
  	@private
   */
  NavigationLoader.prototype.configLoaded = function(evt) {
    var data, _ref, _ref1;
    if (evt != null) {
      if ((_ref = evt.currentTarget) != null) {
        _ref.off(AssetLoader.COMPLETE_FILE, this.configLoaded);
      }
    }
    data = evt.result;
    paths = PathsData.getInstance(data.paths);
    config = new ParseConfig(paths.translate(data));
    this.trigger(NavigationLoader.CONFIG_LOADED, {
      data: config.data
    });
    if (typeof app !== "undefined" && app !== null ? (_ref1 = app.detections) != null ? _ref1.cache : void 0 : void 0) {
      new ServiceWorkerController();
    }
    this.loadContents();
    return false;
  };
  /**
  	@method loadContents
  	@private
   */
  NavigationLoader.prototype.loadContents = function() {
    var content, contents, i, queue;
    if (totalContentsLoaded == null) {
      totalContentsLoaded = 0;
    }
    contents = config.contents;
    if (contents.length > 0) {
      i = contents.length;
      while (i-- > 0) {
        content = contents[i];
        if (content.loadContent || content.loadContent === void 0) {
          queue = this.loader.getGroup(content.group || content.id);
          queue.on(AssetLoader.COMPLETE_FILE, this.contentLoaded);
          queue.loadFile(content, false);
          queue.load();
        } else {
          this.contentLoaded(null);
        }
      }
    } else {
      this.initialQueue();
    }
    return false;
  };
  /**
  	@method contentLoaded
  	@param {Event} evt
  	@private
   */
  NavigationLoader.prototype.contentLoaded = function(evt) {
    var _ref;
    if (evt != null) {
      if ((_ref = evt.currentTarget) != null) {
        _ref.off(AssetLoader.COMPLETE_FILE, this.contentLoaded);
      }
    }
    if (evt != null ? evt.item : void 0) {
      if (config.views[evt.item.id]) {
        config.views[evt.item.id].content = paths.translate(evt.item.result);
      } else if (config.required[evt.item.group][evt.item.id]) {
        config.required[evt.item.group].content = paths.translate(evt.item.result);
        delete config.required[evt.item.group][evt.item.id];
      }
    }
    totalContentsLoaded++;
    if (totalContentsLoaded === config.contents.length) {
      return this.initialQueue();
    }
  };
  /**
  	@method initialQueue
  	@private
   */
  NavigationLoader.prototype.initialQueue = function() {
    var assets, content, data, firstIndexes, id, k, queue, total, v, _ref, _ref1, _ref2;
    assets = [];
    loaderSteps = [];
    _ref = config.views;
    for (k in _ref) {
      v = _ref[k];
      data = v.content;
      if (data != null) {
        content = new ParseContent(data);
        assets[v.id] = content.initialAssets;
      }
    }
    for (id in config.required) {
      data = config.required[id].content;
      if (data != null) {
        content = new ParseContent(data);
        if (assets[id]) {
          assets[id].concat(content.initialAssets);
        } else {
          assets[id] = content.initialAssets;
        }
      }
      _ref1 = config.required[id];
      for (k in _ref1) {
        v = _ref1[k];
        if (v.src) {
          v.internal = false;
          if (v.src !== ((_ref2 = config.required[id].content) != null ? _ref2.src : void 0)) {
            if (assets[id]) {
              assets[id].push(v);
            } else {
              assets[id] = [];
              assets[id].push(v);
            }
          }
        }
      }
    }
    total = ObjectUtils.count(assets);
    firstIndexes = loaderSteps.length;
    for (k in assets) {
      v = assets[k];
      switch (k) {
        case 'preloader':
        case 'core':
        case 'main':
          loaderSteps.splice(firstIndexes, 0, {
            id: k,
            data: v,
            ratio: 1 / total
          });
          firstIndexes++;
          break;
        default:
          loaderSteps.push({
            id: k,
            data: v,
            ratio: 1 / total
          });
      }
    }
    this.trigger(NavigationLoader.LOAD_START);
    currentStep = loaderSteps[0];
    queue = this.addLoader(currentStep.id);
    this.addFiles(currentStep.data, queue);
    queue.load();
    return false;
  };
  /**
  	@method addLoader
  	@param {String} p_id
  	@return {createjs.LoadQueue}
  	@private
   */
  NavigationLoader.prototype.addLoader = function(p_id) {
    var queue;
    queue = this.loader.getGroup(p_id);
    queue.on(AssetLoader.COMPLETE_FILE, this.loadFileComplete);
    queue.on(AssetLoader.PROGRESS_ALL, this.loadProgress);
    queue.on(AssetLoader.COMPLETE_ALL, this.loadComplete);
    return queue;
  };
  /**
  	@method removeLoader
  	@param {createjs.LoadQueue} p_queue
  	@return {createjs.LoadQueue}
  	@private
   */
  NavigationLoader.prototype.removeLoader = function(p_queue) {
    p_queue.off(AssetLoader.COMPLETE_FILE, this.loadFileComplete);
    p_queue.off(AssetLoader.PROGRESS_ALL, this.loadProgress);
    p_queue.off(AssetLoader.COMPLETE_ALL, this.loadComplete);
    p_queue.destroy();
    return p_queue;
  };
  /**
  	@method addFiles
  	@param {createjs.LoadQueue} p_queue
  	@param {Object} p_files
  	@private
   */
  NavigationLoader.prototype.addFiles = function(p_files, p_queue) {
    var f, jsRE, src, _i, _len;
    jsRE = /.*\.(js|css|svg)$/g;
    for (_i = 0, _len = p_files.length; _i < _len; _i++) {
      f = p_files[_i];
      f.loaded = false;
      if ((f != null ? f.src : void 0) != null) {
        if ((f.id == null) || f.id === void 0) {
          src = removeParam('noCache', f.src);
          src = removeParam('v', f.src);
          f.id = src;
        }
        if (f.src.indexOf('.json') !== -1) {
          f.src = f.src;
        }
        jsRE.lastIndex = 0;
        if (typeof f === 'string') {
          if (jsRE.test(f)) {
            f = {
              src: f,
              type: 'text'
            };
          }
        } else if (f.src && jsRE.test(f.src)) {
          f['type'] = 'text';
        }
        p_queue.loadFile(f, false);
      }
    }
    return false;
  };
  /**
  	@method loadFileComplete
  	@param {Event} evt
  	@private
   */
  NavigationLoader.prototype.loadFileComplete = function(evt) {
    var contents, data, e, head, main, result, si, style, _ref, _ref1, _ref2;
    evt.item.loaded = true;
    switch (evt.item.ext) {
      case 'json':
        data = paths.translate(evt.result);
        if (typeof data !== 'string') {
          data = JSON.stringify(data);
        }
        JSONUtils.removeComments(data);
        result = data;
        evt.item.result = evt.item.tag = evt.result = JSON.parse(result);
        break;
      case 'js':
        data = evt.result;
        data = data.replace(/^\/\/.*?(\n|$)/igm, '');
        if (currentStep.id === 'main') {
          main = result = evt.item.result = eval(data);
        } else {
          result = eval('(function (){' + data + '}).call(self)');
        }
        break;
      case 'css':
        head = document.querySelector("head") || document.getElementsByTagName("head")[0];
        style = document.createElement('style');
        style.id = evt.item.id;
        style.type = "text/css";
        head.appendChild(style);
        si = head.querySelectorAll('style').length;
        try {
          style.appendChild(document.createTextNode(evt.result));
        } catch (_error) {
          e = _error;
          if (document.all) {
            document.styleSheets[si].cssText = evt.result;
          }
        }
        result = style;
        break;
      default:
        result = evt.item;
    }
    contents = ((_ref = config.views[currentStep.id]) != null ? _ref.content : void 0) || ((_ref1 = config.required[currentStep.id]) != null ? _ref1.content : void 0);
    if ((contents != null) && evt.item.internal !== false) {
      eval('contents["' + ((_ref2 = evt.item.___path) != null ? _ref2.join('"]["') : void 0) + '"] = result');
    }
    if (main != null) {
      main.content = contents;
    }
    this.trigger(NavigationLoader.LOAD_FILE_COMPLETE, {
      id: evt.item.id,
      group: currentStep.id,
      data: evt.item,
      result: result
    });
    return false;
  };
  /**
  	@method removeParam
  	@param {String} p_param
  	@param {String} p_url
  	@private
   */
  removeParam = function(p_param, p_url) {
    var i, param, params, query, results;
    param = null;
    params = [];
    results = p_url.split('?')[0];
    query = p_url.indexOf('?') !== -1 ? p_url.split('?')[1] : '';
    if (query !== '') {
      params = query.split('&');
      i = params.length - 1;
      while (i >= 0) {
        param = params[i].split('=')[0];
        if (param === p_param) {
          params.splice(i, 1);
        }
        i -= 1;
      }
      if (params.length > 0) {
        results = results + '?' + params.join('&');
      }
    }
    return results;
  };
  /**
  	@method loadProgress
  	@param {Event} evt
  	@private
   */
  NavigationLoader.prototype.loadProgress = function(evt) {
    this.trigger(NavigationLoader.LOAD_PROGRESS, {
      progress: (evt.loaded / evt.total) * currentStep.ratio + loaderRatio
    });
    return false;
  };
  /**
  	@method loadComplete
  	@param {Event} evt
  	@private
   */
  NavigationLoader.prototype.loadComplete = function(evt) {
    var queue, step;
    this.removeLoader(evt.currentTarget);
    step = loaderSteps[loaderStep];
    this.assetsLoaded(step != null ? step.id : void 0);
    loaderRatio += step.ratio;
    loaderStep++;
    if (loaderStep >= loaderSteps.length) {
      this.trigger(NavigationLoader.LOAD_COMPLETE);
    } else {
      currentStep = loaderSteps[loaderStep];
      queue = this.addLoader(currentStep.id);
      this.addFiles(currentStep.data, queue);
      queue.load();
      if (queue._loadQueue.length + queue._currentLoads.length === 0) {
        this.loadComplete();
      }
    }
    return false;
  };
  /**
  	Called when the others groups is completely loaded.
  	@method assetsLoaded 
  	@param {String} p_id
  	@private
   */
  NavigationLoader.prototype.assetsLoaded = function(p_id) {
    if (p_id == null) {
      return;
    }
    this.trigger(NavigationLoader.GROUP_ASSETS_LOADED, {
      id: p_id,
      data: this.loader.getGroup(p_id)
    });
    return false;
  };
  return NavigationLoader;
})(EventDispatcher);
var TemplatePreloaderView;
TemplatePreloaderView = (function(_super) {
  __extends(TemplatePreloaderView, _super);
  function TemplatePreloaderView(p_data, p_className) {
    if (p_data == null) {
      p_data = null;
    }
    if (p_className == null) {
      p_className = null;
    }
    this.destroy = __bind(this.destroy, this);
    this.hide = __bind(this.hide, this);
    this.createStart = __bind(this.createStart, this);
    TemplatePreloaderView.__super__.constructor.call(this, p_data, 'preloaderCustonCSS');
  }
  TemplatePreloaderView.set({
    progress: function(p_value) {
      if (this.content != null) {
        return this.text = this.content.label + " " + Math.round(p_value * 100) + "%";
      } else {
        return this.text = Math.round(p_value * 100) + "%";
      }
    }
  });
  TemplatePreloaderView.prototype.createStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.css({
      'width': '100%',
      'height': '100%',
      'font-size': '5em',
      'text-align': 'center',
      'background-color': '#' + Math.floor(Math.random() * 16777215).toString(16)
    });
    return TemplatePreloaderView.__super__.createStart.apply(this, arguments);
  };
  TemplatePreloaderView.prototype.hide = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return TweenMax.to(this.element, 1, {
      delay: .5,
      opacity: 0,
      onComplete: (function(_this) {
        return function() {
          return TemplatePreloaderView.__super__.hide.apply(_this, arguments);
        };
      })(this)
    });
  };
  TemplatePreloaderView.prototype.destroy = function(evt) {
    if (evt == null) {
      evt = null;
    }
    TweenMax.killTweensOf(this.element);
    return TemplatePreloaderView.__super__.destroy.apply(this, arguments);
  };
  return TemplatePreloaderView;
})(BaseView);
var Preloader;
Preloader = (function(_super) {
  __extends(Preloader, _super);
  function Preloader() {
    Preloader.__super__.constructor.call(this, new TemplatePreloaderView());
  }
  return Preloader;
})(NavigationLoader);
app.on('windowLoad', (function(_this) {
  return function() {
    return new Preloader();
  };
})(this));
}).call(this);