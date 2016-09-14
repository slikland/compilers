"(function() {var __bind=function(fn, me){ return function(){ return fn.apply(me, arguments); }; },__hasProp={}.hasOwnProperty,__indexOf=[].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },__extends=function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) Object.defineProperty(child, key, Object.getOwnPropertyDescriptor(parent, key)); } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };function __addNamespace(scope, obj){for(k in obj){if(!scope[k]) scope[k] = {};__addNamespace(scope[k], obj[k])}};__addNamespace(this, {\"slikland\":{\"test\":{}}});var CoffeeCompiler;CoffeeCompiler = (function() {var File, Task;CoffeeCompiler._ADD_NAMESPACE_FN = 'function __addNamespace(scope, obj){for(k in obj){if(!scope[k]) scope[k] = {};__addNamespace(scope[k], obj[k])}};';CoffeeCompiler._REWRITE_CS_FUNCTIONS = {\"__bind\": 'function(fn, me){ return function(){ return fn.apply(me, arguments); }; }',\"__hasProp\": '{}.hasOwnProperty',\"__indexOf\": '[].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; }',\"__extends\": 'function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) Object.defineProperty(child, key, Object.getOwnPropertyDescriptor(parent, key)); } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; }'};function CoffeeCompiler() {this._cache = {};this._tasks = [];this._usedFiles = [];this._running = false;this.ugly = false;}CoffeeCompiler.prototype.addTask = function(name, task) {return this._tasks[this._tasks.length] = new Task(name, task);};CoffeeCompiler.prototype.start = function(sourcePaths) {if (sourcePaths == null) {sourcePaths = [];}if (this._running) {return;}this._sourcePaths = sourcePaths;this._running = true;return this._runTasks();};CoffeeCompiler.prototype.stop = function() {if (!this._running) {return;}return this._running = false;};CoffeeCompiler.prototype.reset = function() {return 1;};CoffeeCompiler.prototype.update = function(file) {if (this._cache[file]) {this._cache[file].update();} else {this._cache[file] = new File(file);}if (this._running) {return this._runTasks(file);}};CoffeeCompiler.prototype.remove = function(files) {var file, i;files = [].concat(files);i = files.length;while (i-- > 0) {file = files[i];if (this._cache[file]) {this._cache[file].dispose();delete this._cache[file];}}return this._runTasks();};CoffeeCompiler.prototype.runTasks = function(ugly) {if (ugly == null) {ugly = false;}return this._runTasks(null, ugly);};CoffeeCompiler.prototype._runTasks = function(file, ugly, version) {var c, files, i, t;if (file == null) {file = null;}if (ugly == null) {ugly = false;}if (version == null) {version = null;}ugly = ugly;this._initTime = new Date().getTime();this._updateTasks();Log.println();i = this._tasks.length;c = 0;while (i-- > 0) {files = this._filterTask(this._tasks[i]);if (file) {if (files.indexOf(file) >= 0) {c++;this._tasks[i].output(ugly, version);}} else {c++;this._tasks[i].output(ugly, version);}}if (c > 0) {t = ((new Date().getTime() - this._initTime) * 0.001).toFixed(3);Log.setStyle('cyan');Log.println('In: ' + t + 's');return Notifier.notify('Compiler', 'Coffee compilation completed!');}};CoffeeCompiler.prototype._updateTasks = function() {var i, _results;i = this._tasks.length;_results = [];while (i-- > 0) {this._tasks[i].filtered = false;this._tasks[i].usedBy = {};_results.push(this._tasks[i].update(this._cache, this._sourcePaths));}return _results;};CoffeeCompiler.prototype._findTask = function(name) {var i;i = this._tasks.length;while (i-- > 0) {if (this._tasks[i].name === name) {return this._tasks[i];}}return null;};CoffeeCompiler.prototype._filterTask = function(task) {var c, files, hasNamespaces, i, j, k, l, namespaces, source, t, usedFiles;if (task.filtered) {return task.filteredFiles;}files = task.usedFiles;if (task.depends) {i = task.depends.length;while (i-- > 0) {t = this._findTask(task.depends[i]);if (!t) {continue;}usedFiles = this._filterTask(t);j = usedFiles.length;while (j-- > 0) {if ((k = files.indexOf(usedFiles[j])) >= 0) {files.splice(k, 1);}}}}task.filtered = true;task.filteredFiles = files;i = -1;l = files.length;namespaces = {};hasNamespaces = false;source = '';while (++i < l) {c = this._cache[files[i]];if (c) {if (this._addNamespaces(c.namespaces, namespaces)) {hasNamespaces = true;}source += c.js + '\\n';}}if (hasNamespaces) {source = this.constructor._ADD_NAMESPACE_FN + '\\n' + '__addNamespace(this, ' + JSON.stringify(namespaces) + ');\\n' + source;}source = this._rewriteCsFuncs(source);if (!task.bare) {source = '(function() {\\n' + source + '}).call(this);';}task.rawSource = source;return files;};CoffeeCompiler.prototype._rewriteCsFuncs = function(source) {var fs, k, re, s, v, _ref;s = source;fs = [];_ref = this.constructor._REWRITE_CS_FUNCTIONS;for (k in _ref) {v = _ref[k];re = new RegExp('^\\\\s*' + k + '\\\\s*=.*?(,|;)\\\\s*$', 'gm');s = s.replace(re, '$1');fs.push(k + '=' + v);}s = s.replace(/^\\s*,?(;)?\\s*\\n/gm, '$1');s = s.replace(/,\\s*\\n\\s*;/g, ';\\n');if (fs.length > 0) {s = 'var ' + fs.join(',\\n') + ';\\n' + s;}return s;};CoffeeCompiler.prototype._addNamespaces = function(namespaces, nsObj) {var added, n, ns, _i, _j, _len, _len1;added = false;for (_i = 0, _len = namespaces.length; _i < _len; _i++) {ns = namespaces[_i];ns = ns.split('.');for (_j = 0, _len1 = ns.length; _j < _len1; _j++) {n = ns[_j];if (!nsObj[n]) {nsObj[n] = {};added = true;}nsObj = nsObj[n];}}return added;};CoffeeCompiler.prototype.parseFile = function() {};CoffeeCompiler.prototype.fileChanged = function() {};Task = (function() {function Task(name, data) {var _ref;this.name = name;this.data = data;this._buildVersion = __bind(this._buildVersion, this);this.usedFiles = [];this.bare = (_ref = this.data.options) != null ? _ref.bare : void 0;this.isNode = this.data.isNode;if (this.data.depends) {this.depends = [].concat(this.data.depends);}}Task.prototype.update = function(cache, sourcePaths) {var files, k, src, usedFiles, v;this.usedFiles.length = 0;src = this.data.src;files = [];if (this.data.includes) {files = files.concat([].concat(this.data.includes));}files.push(this.data.src);for (k in cache) {v = cache[k];v.usedBy = {};}usedFiles = this._parseFilesRecursive(cache, sourcePaths, files);return this.usedFiles = this._removeDuplicates(usedFiles);};Task.prototype._buildVersion = function(p_type) {var _base;return typeof (_base = this.versioner).nextVersion === \"function\" ? _base.nextVersion(p_type) : void 0;};Task.prototype.output = function(ugly, version) {var dir, e, out, p;if (ugly == null) {ugly = false;}if (version == null) {version = null;}out = null;Log.setStyle('magenta');Log.print('Compiling ' + this.name);if (ugly) {Log.setStyle('yellow');Log.print(' minified');}Log.println();p = path.resolve(this.data.output);dir = path.dirname(p);if (!fs.existsSync(dir)) {this._mkdir(dir);}out = this.rawSource;if (ugly) {try {out = uglify.minify(out, {fromString: true,comments: true}).code;} catch (_error) {e = _error;console.log(e);}}if (this.isNode) {out = '#!/usr/bin/env node\\n' + out;}fs.writeFileSync(p, out, {encoding: 'utf-8'});Log.setStyle('green');Log.print('Saved to: ');Log.setStyle('magenta');Log.println(this.data.output);if (this.versioner == null) {this.versioner = new Versioner(this.data.output);}return this._buildVersion(version);};Task.prototype._mkdir = function(dir) {var d;d = path.dirname(dir);if (!fs.existsSync(d)) {this._mkdir(d);}return fs.mkdirSync(dir);};Task.prototype._removeDuplicates = function(files) {var f, filteredFiles, i, l, p, usedFiles;usedFiles = {};filteredFiles = [];p = 0;i = -1;l = files.length;while (++i < l) {f = files[i];if (!usedFiles[f]) {usedFiles[f] = true;filteredFiles[p++] = f;}}return filteredFiles;};Task.prototype._parseFilesRecursive = function(cache, sourcePaths, files) {var appends, found, i, i1, i2, j, k, l1, l2, p, pFiles, prepends, tp, usedFiles, v, _files;prepends = [];appends = [];usedFiles = [];files = [].concat(files);_files = [].concat(files);i = _files.length;while (i-- > 0) {if (_files[i].indexOf('*') >= 0) {tp = _files[i].replace(/\\./g, '\\\\.').replace(/\\*/g, '.*?');l2 = sourcePaths.length;i2 = -1;while (++i2 < l2) {p = path.resolve(sourcePaths[i2]) + '/' + tp;p = new RegExp(p, 'ig');pFiles = [];j = 0;found = false;for (k in cache) {v = cache[k];p.lastIndex = 0;if (p.test(k)) {found = true;pFiles[j++] = k;}}pFiles.unshift(i, 1);_files.splice.apply(_files, pFiles);if (found) {break;}}}}files = _files;i1 = -1;l1 = files.length;while (++i1 < l1) {i2 = -1;l2 = sourcePaths.length;found = false;while (++i2 < l2) {p = files[i1];if (!/^\\//.test(p)) {p = path.resolve(sourcePaths[i2] + p);}if (cache[p]) {found = true;if (cache[p].usedBy[this.name]) {usedFiles = [].concat(cache[p].usedBy[this.name], usedFiles);break;}usedFiles = [].concat(usedFiles, this._parseFilesRecursive(cache, sourcePaths, cache[p].prepend, p));usedFiles[usedFiles.length] = p;usedFiles = [].concat(usedFiles, this._parseFilesRecursive(cache, sourcePaths, cache[p].append, p));cache[p].usedBy[this.name] = usedFiles;break;}}if (!found) {Log.setStyle('red');Log.print('Import not found: ');Log.setStyle('cyan');Log.print(files[i1]);}}return usedFiles;};return Task;})();File = (function() {function File(file) {this.file = file;this._replaceInjection = __bind(this._replaceInjection, this);this.prepend = [];this.append = [];this.namespaces = [];this.isJS = false;if (fs.existsSync(this.file)) {this.update();} else {throw new Error('File not found: ' + this.file);}}File.prototype.update = function() {var e;if (fs.existsSync(this.file)) {this.content = fs.readFileSync(this.file, 'utf8');try {this.content = this.content.replace(/^(\\s*)(.*?)#\\s*inject\\s+(['|\"])?([^\\s'\"]+)(\\3)(.*?)$/mg, this._replaceInjection);this.parseContent();if (/\\.js$/ig.test(this.file)) {return this.js = this.content;} else {return this.js = coffee.compile(this.content, {bare: true});}} catch (_error) {e = _error;Log.setStyle('red');Log.print('Error parsing ');Log.setStyle('cyan');Log.println(this.file);Log.setStyle('magenta');Log.println(e.message + '\\nat line ' + (e.location.first_line + 1));return Notifier.notify('Error compiling', this.file);}} else {throw new Error('File not found: ' + this.file);}};File.prototype.parseContent = function() {var ai, f, importRE, l, match, ns, pi;importRE = /#\\s*(import|\\@codekit-(prepend|append)|namespace)\\s+(['|\"])?([^\\s'\"]+)(\\2)?/g;pi = ai = 0;this.prepend.length = 0;this.append.length = 0;this.namespaces.length = 0;while ((match = importRE.exec(this.content))) {f = match[4];switch (match[1]) {case 'import':case 'codekit':if (!/\\.js$/ig.test(f)) {f = f.replace(/\\./g, '/') + '.coffee';}if (match[2] === 'append') {this.append[ai++] = f;} else {this.prepend[pi++] = f;}break;case 'namespace':this.namespaces.push(f);}}if ((l = this.namespaces.length) > 0) {ns = this.namespaces[l - 1];return this.content = this.content.replace(/^(class\\s+)([^\\s]+)/gm, '$1' + ns + '.$2');}};File.prototype._replaceInjection = function() {var content, injectFile, stat;injectFile = path.dirname(this.file) + '/' + arguments[4];content = '';if (fs.existsSync(injectFile)) {stat = fs.statSync(injectFile);if (stat.isFile()) {content = fs.readFileSync(injectFile, 'utf8');}}content = content.replace(/^/gm, arguments[1]).replace(/^\\s*/, '').replace(/\\s*$/, '');content = arguments[1] + arguments[2] + content + arguments[6];return content;};File.prototype.dispose = function() {this.prepend.length = 0;this.append.length = 0;delete this.content;delete this.js;delete this.prepend;return delete this.append;};return File;})();return CoffeeCompiler;})();var EventDispatcher;EventDispatcher = (function() {function EventDispatcher() {this._triggerNative = __bind(this._triggerNative, this);this.trigger = __bind(this.trigger, this);}EventDispatcher.prototype._events = null;EventDispatcher.prototype.on = function(p_event, p_handler) {if (!this._events) {this._events = {};}if (!this._events[p_event]) {this._events[p_event] = [];}if (!(__indexOf.call(this._events[p_event], p_handler) >= 0)) {return this._events[p_event].unshift(p_handler);}};EventDispatcher.prototype.off = function(p_event, p_handler) {var events, i;if (p_event == null) {p_event = null;}if (p_handler == null) {p_handler = null;}if (!this._events) {this._events = {};return;}if (!p_event) {this.offAll();return;}if (events = this._events[p_event]) {if (!p_handler) {return this._events[p_event].length = 0;} else {while ((i = events.indexOf(p_handler)) >= 0) {events.splice(i, 1);}return this._events[p_event] = events;}} else if (!p_event) {return this.offAll();}};EventDispatcher.prototype.offAll = function() {this._events = {};return false;};EventDispatcher.prototype.trigger = function(evt, data, target) {var e, events, i, k, v, _i, _len, _results;if (data == null) {data = null;}if (target == null) {target = null;}if (Array.isArray(evt)) {for (_i = 0, _len = evt.length; _i < _len; _i++) {e = evt[_i];this.trigger(evt, data);}return;}if (!this._events) {this._events = {};}events = this._events[evt];if (!events || events.length === 0) {return;}if (!target) {target = this;}e = {type: evt,target: target,currentTarget: this};if (typeof data === 'object') {for (k in data) {v = data[k];if (!e[k]) {e[k] = v;}}}i = events.length;_results = [];while (i-- > 0) {_results.push(typeof events[i] === \"function\" ? events[i](e, data) : void 0);}return _results;};EventDispatcher.prototype._triggerNative = function(p_event) {var events, i, _results;if (!this._events) {this._events = {};}events = this._events[p_event.type];if (!events || events.length === 0) {return;}i = events.length;p_event.targetClass = this;_results = [];while (i-- > 0) {_results.push(typeof events[i] === \"function\" ? events[i](p_event) : void 0);}return _results;};EventDispatcher.prototype.hasEvent = function(p_event, p_handler) {var event;for (event in this._events) {if (event === p_event) {if (this._events[event].indexOf(p_handler) > -1) {return true;}}}return false;};return EventDispatcher;})();slikland.test.Test2 = (function() {function Test2() {this.a = 1;console.log(slikland.test.Test2);}return Test2;})();var Test, Test2;Test = (function() {function Test() {var a;new sl.display.BaseDOM();a = new slikland.test.Test2();}return Test;})();Test2 = (function() {function Test2() {this.a = 2;}return Test2;})();new Test();/**Teste para docs@class Preloader*/var Preloader;Preloader = (function() {function Preloader() {1;}Preloader.prototype.___project = function() {return {\"version\":\"0.0.0\",\"author\":\"© Slikland Creative Development\"};};return Preloader;})();}).call(this);"