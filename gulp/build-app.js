const gulp = require("gulp");
const del = require("del");
const annotate = require("gulp-ng-annotate");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const sourcemaps = require("gulp-sourcemaps");
const plumber = require("gulp-plumber");
// const env = require('gulp-env');
const livereload = require("gulp-livereload");

gulp.task("clean:dist", function () {
  return del(["./dist/**/*"]);
});

gulp.task("build-app", ["clean:dist"], () => {
  return gulp.start(["build-js-min", "build-css", "build-html", "build-bower"])
});

gulp.task("build-js", () => {
  return gulp.src("./angular-app/app/**/*.js")
    .pipe(plumber())
    .pipe(concat("app.min.js"))
    .pipe(annotate())
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./dist/"))
    .pipe(livereload());
});

gulp.task("build-js-min", () => {
  return gulp.src("./angular-app/app/**/*.js")
    .pipe(plumber())
    // .pipe(env({ file: ".env"}))
    .pipe(concat("app.min.js"))
    .pipe(annotate())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./dist/"))
    .pipe(livereload());
});

gulp.task("build-js-min:prod", () => {
  return gulp.src("./angular-app/app/**/*.js")
    .pipe(plumber())
    .pipe(env({ file: ".env"}))
    .pipe(concat("app.min.js"))
    .pipe(annotate())
    .pipe(uglify())
    .pipe(gulp.dest("./dist/"))
});

gulp.task("build-css", () => {
  return gulp.src("./angular-app/app/**/*.css")
    .pipe(plumber())
    .pipe(concat("styles.css"))
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./dist/"))
    .pipe(livereload());
});

gulp.task("build-html", () => {
  return gulp.src("./angular-app/app/components/**/*.html")
    .pipe(plumber())
    .pipe(gulp.dest("./dist/templates"))
    .pipe(livereload());
});

gulp.task("build-bower", () => {
  return gulp.src(["./angular-app/bower_components/**/*.min.*", "./angular-app/bower_components/**/fonts/*"])
    .pipe(plumber())
    .pipe(gulp.dest("./dist/bower"))
    .pipe(livereload());
});