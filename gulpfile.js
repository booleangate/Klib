var gulp = require("gulp");
var jshint = require("gulp-jshint");
var watchify = require("watchify");
var browserify = require("browserify");
var rename = require("gulp-rename");
var util = require("gulp-util");
var source = require("vinyl-source-stream");
var uglify = require("gulp-uglify");


function getBundler(params) {
	if (!params) {
		params = {};
	}
	
	params.standalone = "K";
	params.debug = true;
	
	return browserify("./src/K.js", params);
}

function build(bundle) {
	return bundle.on("error", util.log.bind(util, "Browserify Error"))
		.bundle()
		.pipe(source("bundle.js"))
		.pipe(rename("K.js"))
		.pipe(gulp.dest("./dist"));
}

function finalize() {
	return gulp.src("./dist/K.js")
		.pipe(uglify())
		.pipe(rename({suffix: ".min"}))
		.pipe(gulp.dest("./dist"));
}

gulp.task("lint", function() {
	return gulp.src("./src/**/*.js")
		.pipe(jshint({
			unused: true,
			eqnull: true
		}))
		.pipe(jshint.reporter("default"));
});

gulp.task("build", function() {
	return build(getBundler());
});

gulp.task("watch", function() {
	var bundler = watchify(getBundler(watchify.args));
	
	function rebundle() {
		var stream = build(bundler);
		
		finalize();
		
		console.log("Rebuilt at " + new Date());
		
		return stream;
	};
	
	bundler.on("update", rebundle);
});

gulp.task("finalize", ["build"], finalize);

gulp.task("default", ["lint", "build", "finalize"]);
