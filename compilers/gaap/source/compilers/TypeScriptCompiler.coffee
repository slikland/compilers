class TypeScriptCompiler
	constructor:()->
		@_tasks = []
		@_running = false
		@ugly = false

	addTask:(name, task)->
		@_tasks[@_tasks.length] = new Task(name, task)

	start:(sourcePaths = [])->
		if @_running
			return

		@_sourcePaths = sourcePaths

		@_running = true
		@_runTasks()
	stop:()->
		if !@_running
			return
		@_running = false
	reset:()->
		1
	update:(file)->
		if @_running
			@_runTasks()

	remove:(files)->
		@_runTasks()
	
	runTasks:(ugly = false, version = null)->
		console.log('run-version', version)
		@_runTasks(null, ugly, version)

	_runTasks:(file = null, ugly = false, version = null)->
		ugly = ugly
		@_initTime = new Date().getTime()

		Log.println()

		i = @_tasks.length
		c = 0
		while i-- > 0
			c++
			@_tasks[i].output(@_sourcePaths, ugly, version)


	class Task

		constructor:(@name, @data)->
			@usedFiles = []
			@bare = @data.options?.bare
			@isNode = @data.isNode
			if @data.depends
				@depends = [].concat(@data.depends)

		output:(sourcePaths, ugly = false, version = null)->
			@_initTime = new Date().getTime()
			Log.setStyle('magenta')
			Log.print('Compiling ' + @name)
			if ugly
				Log.setStyle('yellow')
				Log.print(' minified')
			Log.println()

			versioner = new Versioner(@data.output)
			if versioner.isVersioning()
				versionResults = versioner.nextVersion(version)
				versioning = {
					versioner: versioner
					results: versionResults
				}

			p = path.resolve(@data.output)
			dir = path.dirname(p)
			if !fs.existsSync(dir)
				@_mkdir(dir)

			i = -1
			l = sourcePaths.length
			out = null
			while ++i < l
				psrc = path.resolve(sourcePaths[i] + @data.src)
				filename = path.basename(psrc, path.extname(psrc))
				if fs.existsSync(psrc)
					exec('vendors/typescript/bin/tsc --locale en --alwaysStrict --lib dom,es2015 --module amd --target es5 --outFile '+p+' '+psrc, @_compiled.bind(@, ugly, versioning) )
					break

		_shimJs:(path, ugly)->
			if fs.existsSync(path)
				output = fs.readFileSync(path, 'utf8')
				if output.indexOf(@constructor.BUNDLE_PACK) is -1
					output = @constructor.BUNDLE_PACK.replace('{{BUNDLE}}', output)	
				return output
			return ''

		_compiled:(ugly, versioning, error, output, errorMessage)=>
			if /error TS/gi.test(output) or !!error
				Log.setStyle('red')
				Log.print('Error compiling: ')
				Log.setStyle('cyan')
				Log.println(@name)
				process.stdout.write(output + '\n', error)
				return
			p = path.resolve(@data.output)
			out = @_shimJs(p)

			if versioning?.results
				results = versioning.results
				versioner = versioning.versioner
				out = out.replace(versioner.versionRegex, results[0])
				out = out.replace(versioner.dateRegex, results[1])
				versioner.destroy()

			if ugly
				try
					out = uglify.minify(out, {fromString:true, comments:true}).code
					if @isNode
						out = '#!/usr/bin/env node\n' + out
				catch e
					console.log(e)

			fs.writeFileSync(p, out, {encoding: 'utf-8'})

			Log.setStyle('green')
			Log.print('Saved to: ')
			Log.setStyle('magenta')
			Log.println(@data.output)
			t = ((new Date().getTime() - @_initTime) * 0.001).toFixed(3)
			Log.setStyle('cyan')
			Log.println('In: ' + t + 's')
			Notifier.notify('Compiler', 'TypeScript compilation completed!')

		_mkdir:(dir)->
			d = path.dirname(dir)
			if !fs.existsSync(d)
				@_mkdir(d)
			fs.mkdirSync(dir)

		@BUNDLE_PACK:"""
(function () {
var main = null;
var modules = {
	"require": {
		factory: undefined,
		dependencies: [],
		exports: function (args, callback) { return require(args, callback); },
		resolved: true
	}
};
function define(id, dependencies, factory) {
	return main = modules[id] = {
		dependencies: dependencies,
		factory: factory,
		exports: {},
		resolved: false
	};
}
function resolve(definition) {
	if (definition.resolved === true)
			return;
	definition.resolved = true;
	var dependencies = definition.dependencies.map(function (id) {
		return (id === "exports")
			? definition.exports
			: (function () {
				if(modules[id] !== undefined) {
					resolve(modules[id]);
					return modules[id].exports;
				} else {
					try {
						return require(id);
					} catch(e) {
						throw Error("module '" + id + "' not found.");
					}
				}
			})();
	});
	definition.factory.apply(null, dependencies);
}
function collect() {
	Object.keys(modules).map(function (key) { return modules[key]; }).forEach(resolve);
	return (main !== null) 
		? main.exports
		: undefined
}\n

{{BUNDLE}}

return collect(); \n})();
"""