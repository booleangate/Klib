var gulp = require("gulp");
var jshint = require("gulp-jshint");
var watchify = require("watchify");
var browserify = require("browserify");
var rename = require("gulp-rename");
var util = require("gulp-util");
var source = require("vinyl-source-stream");
var uglify = require("gulp-uglify");

var jsHintConfig = {
	unused: true,
	eqnull: true
};

function build(stream) {
	return stream.on("error", util.log.bind(util, "Browserify Error"))
		.bundle()
		.pipe(source("bundle.js"))
		.pipe(rename("K.js"))
		.pipe(gulp.dest("./dist"));
}

function compile(params) {
	return browserify("./src/K.js", params);
}

function finalize() {
	return gulp.src("./dist/K.js")
		.pipe(uglify())
		.pipe(rename({suffix: ".min"}))
		.pipe(gulp.dest("./dist"));
}

gulp.task("lint", function() {
	return gulp.src("./src/**/*.js")
		.pipe(jshint(jsHintConfig))
		.pipe(jshint.reporter("default"));
});

gulp.task("build", function() {
	return build(compile());
});

gulp.task("watch", function() {
	var bundler = watchify(compile(watchify.args));
	
	function rebundle() {
		var stream = build(bundler);
		
		console.log("Done rebundling");
		
		finalize();
		
		console.log("Done finalizing");
		
		return stream;
	};
	
	bundler.on("update", rebundle);
	
	return rebundle();
});

gulp.task("finalize", ["build"], finalize);

gulp.task("default", ["lint", "build", "finalize"]);
