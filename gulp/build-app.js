const gulp = require("gulp");
const annotate = require("gulp-ng-annotate");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const sourcemaps = require("gulp-sourcemaps");
const livereload = require("gulp-livereload");

gulp.task("build-app", () => {
  return gulp.src("public/app/**/*.js")
    .pipe(concat("app.min.js"))
    .pipe(annotate())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./dist/"))
    .pipe(livereload());
});
