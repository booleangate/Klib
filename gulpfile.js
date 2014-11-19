var gulp = require("gulp");
var config	= require("./package");
var jshint = require("gulp-jshint");
var browserify = require("browserify");
var rename = require("gulp-rename");
var util = require("gulp-util");
var source = require("vinyl-source-stream");
var uglify = require("gulp-uglify");

gulp.task("lint", function() {
	return gulp.src("./src/**/*.js")
		.pipe(jshint(config.jshint))
		.pipe(jshint.reporter("default"));
});

gulp.task("build", function() {
	return browserify("./src/K.js")
		.on("error", util.log.bind(util, "Browserify Error"))
		.bundle()
		.pipe(source("bundle.js"))
		.pipe(rename("K.js"))
		.pipe(gulp.dest("./dist"));
});

gulp.task("finalize", function() {
	return gulp.src("./dist/K.js")
		.pipe(gulp.dest("./dist"))
		.pipe(rename("K.min.js"))
		.pipe(uglify())
		.pipe(gulp.dest("./dist"));
});

gulp.task("default", ["lint", "build", "finalize"]);
