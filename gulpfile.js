var gulp = require("gulp");
var config	= require('./package');
var jshint = require("gulp-jshint");
var source = require("vinyl-source-stream");
var gutil = require('gulp-util');
var watchify = require('watchify');
var browserify = require('browserify');

function getJsStream() {
	// Do not include Backbone, Bootstrap, Underscore, etc.
	return gulp.src("./src/**/*.js");
}

gulp.task("lint", function() {
	return getJsStream()
		.pipe(jshint(config.jshint))
		.pipe(jshint.reporter("default"));
}); 

gulp.task('watch', function() {
	var bundler = watchify(browserify('./src/index.js', watchify.args));

	// Optionally, you can apply transforms
	// and other configuration options on the
	// bundler just as you would with browserify
	bundler.transform('brfs');

	bundler.on('update', rebundle);

	function rebundle() {
		return bundler.bundle()
			// log errors if they happen
			.on('error', gutil.log.bind(gutil, 'Browserify Error'))
			.pipe(source('bundle.js'))
			.pipe(gulp.dest('./dist'));
	}

	return rebundle();
});

gulp.task("default", ["lint"]);
