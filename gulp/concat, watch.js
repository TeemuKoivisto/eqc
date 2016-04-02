const gulp = require("gulp"),
  concat = require("gulp-concat");

gulp.task("concat-js", () => {
  gulp.src("src/**/*.js")
    .pipe(concat("eqc.js"))
    .pipe(gulp.dest("dist/"));
});

gulp.task("watch-src", ["concat-js"], () => {
  gulp.watch("src/**/*.js", ["concat-js"]);
});
