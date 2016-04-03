const gulp = require("gulp"),
  babel = require("gulp-babel");

gulp.task("babel", () =>
  gulp.src("src/**/*.js")
  .pipe(babel({
    presets: ["es2015"]
  }))
  .pipe(gulp.dest("dist/babel/"))
);

const sourcemaps = require("gulp-sourcemaps"),
  concat = require("gulp-concat");

const browserify = require("browserify");
const babelify = require("babelify");
const uglify = require("gulp-uglify");
const livereload = require("gulp-livereload");

gulp.task("babelmap", () => {
  return gulp.src("src/**/*.js")
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat("eqc.js"))
    // .pipe(uglify())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist"))
    // .pipe(livereload());
});

gulp.task("babelmapmin", () => {
  // return gulp.src("src/**/*.js")
  return browserify({entries: "./src/main.js", debug: true})
    .transform("babelify", { presets: ["es2015"] })
    .bundle()
    .pipe(concat("eqc.min.js"))
    .pipe(sourcemaps.init())
    // .pipe(uglify())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist"))
    // .pipe(livereload());
});
