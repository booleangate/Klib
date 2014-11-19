var gulp = require("gulp");
var config	= require('./package');
var jshint = require("gulp-jshint");
var source = require("vinyl-source-stream");
var gutil = require('gulp-util');
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

gulp.task("default", ["lint"]);
