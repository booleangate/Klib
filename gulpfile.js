var gulp = require("gulp");
var jshint = require("gulp-jshint");
var browserify = require("browserify");
var rename = require("gulp-rename");
var util = require("gulp-util");
var source = require("vinyl-source-stream");
var uglify = require("gulp-uglify");

var jsHintConfig =  {
	unused: true,
	eqnull: true
};

gulp.task("lint", function() {
	return gulp.src("./src/**/*.js")
		.pipe(jshint(jsHintConfig))
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

gulp.task("finalize", ["build"], function() {
	return gulp.src("./dist/K.js")
		.pipe(uglify())
		.pipe(rename("K.min.js"))
		.pipe(gulp.dest("./dist"));
});

gulp.task("default", ["lint", "build", "finalize"]);
