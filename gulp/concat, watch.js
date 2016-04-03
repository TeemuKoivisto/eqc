const gulp = require("gulp"),
  concat = require("gulp-concat");

gulp.task("concat-js", () => {
  gulp.src("src/**/*.js")
    .pipe(concat("eqc.js"))
    .pipe(gulp.dest("dist/"));
});

const livereload = require("gulp-livereload");

gulp.task("watch-src", ["concat-js"], () => {
  // livereload.listen();
  gulp.watch("src/**/*.js", ["concat-js"]);
});
