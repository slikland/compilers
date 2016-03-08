// function coffee(src) {
//     return gulp.src(src)
//         .pipe(plugins.coffee(sourceMap: true, sourceRoot: ''))
//         .on('error', gutil.log)
//         .on('error', gutil.beep)
//         .pipe(gulp.dest(config.build))
//         .pipe(plugins.livereload(livereloadServer));
// }
//
// gulp.task('coffee', function() {
//     return coffee(path.join(config.src, '/**/*.coffee'));
// });
//
// gulp.watch(path.join(config.src, '/**/*.coffee'), function(event) {
//     coffee(event.path);
// });

var gulp = require('gulp');
var coffee = require('gulp-coffee')
var stylus = require('gulp-stylus')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var through = require('through2');
var path = require('path');

var _files = {};
var _queue = [];
var config = {
	preloader:{
		entryPoint: '',
		files: {},
		queue: []
	},
	main:{
		entryPoint: '',
		files: {},
		queue: []
	}
};

function searchImports() {
	function transform(file, enc, callback) {
		if (!file.isBuffer()) {
			this.push(file);
			callback();
			return;
		}
		var filename = path.basename(file.path, '.').split('.')[0];
		var contents = file.contents.toString();
		var regex = /#\s*(import)\s+([^\s'"]+)(\2)?/g;
		var match;
		_files[filename] = {name: filename, path:file.path , imports:[]}
		while(match = regex.exec(contents))
		{
			var importData = {};
			var _path = match[2].replace(/\./g, '/') + '.coffee';
			importData['path'] = _path;
			var _p = match[2].split('.');
			importData['filename'] = _p[_p.length-1];
			_files[filename]['imports'].push(importData);
		}
		this.push(file);
		callback();
	}
	return through.obj(transform);
}

function recursiveImport(p_filename){
	if (_files[p_filename]) {
		var _f = _files[p_filename];
		_queue.push(_f['name'])
		var l = _f['imports'].length;
		if (l > 0) {
			while (--l>-1) {
				var _imp = _f['imports'][l];
				if(_imp){
					recursiveImport(_imp['filename'])
				}
			}
		}
	}
}

function selectImports() {
	function transform(file, enc, callback) {
		if (!file.isBuffer()) {
			this.push(file);
			callback();
			return;
		}
		var filename = path.basename(file.path, '.').split('.')[0];
		recursiveImport(filename);
		_queue = _queue.reverse();
		var queue = _queue.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);
		_queue = queue;
		for (var i = 0; i < _queue.length; i++) {
			_name = _queue[i];
			_queue[i] = _files[_name]['path']
		}
		this.push(file);
		callback();
	}
	return through.obj(transform);
}

gulp.task('setupImports', function(){
	_files = {};
	_queue = [];
	return gulp.src("source/coffee/**/*.coffee")
		.pipe(searchImports('a'))
})

gulp.task('organizeImports', ['setupImports'], function(){
	return gulp.src("source/coffee/ford/Main.coffee")
		.pipe(selectImports())
})

gulp.task('test', ['organizeImports'],function(){
	gulp.src(_queue)
		.pipe(concat("final.coffee"))
		.pipe(coffee({bare: true}))
		.pipe(gulp.dest('deploy'))
})

gulp.task('watch', function(){
	gulp.watch("source/coffee/**/*.coffee", ['test'])
});

gulp.task('default', ['test', 'watch']);
