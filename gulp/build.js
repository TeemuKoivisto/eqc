const gulp = require("gulp");
const browserify = require("browserify");
// const babelify = require("babelify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const uglify = require("gulp-uglify");
const sourcemaps = require("gulp-sourcemaps");
const livereload = require("gulp-livereload");

gulp.task("build", () => {
  return browserify({
      entries: "./src/main.js",
      debug: true,
    })
    .transform("babelify", {
      presets: ["es2015"],
    })
    .bundle()
    .pipe(source("eqc.min.js"))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./dist/"))
    .pipe(livereload());
});

gulp.task("watch", ["build"], () => {
  livereload.listen();
  gulp.watch("./src/**/*.js", ["build"]);
});

const	nodemon = require("gulp-nodemon");

gulp.task("nodemon", ["watch"], () => {
	 // livereload.listen();
	nodemon({
		script: "index.js",
		ext: "js html css",
		ignore: ["src/**/*.js", "gulp", "test"]
	}).on("restart", function(){
		console.log("server restart");
		 // livereload.reload();
	})
})
