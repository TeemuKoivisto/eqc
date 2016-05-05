const gulp = require("gulp");
const livereload = require("gulp-livereload");

gulp.task("watch", ["build"], () => {
  livereload.listen();
  gulp.watch("./src/**/*.js", ["build"]);
});

gulp.task("watch-all", ["build", "build-app"], () => {
  livereload.listen();
  gulp.watch("./src/**/*.js", ["build"]);
  gulp.watch("./public/app/**/*.js", ["build-app"]);
});
