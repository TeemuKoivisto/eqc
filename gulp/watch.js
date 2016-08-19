const gulp = require("gulp");
const livereload = require("gulp-livereload");

gulp.task("watch:all", ["build-src", "build-app"], () => {
  livereload.listen();
  // if you use absolute path(./src) watch isn't notified by file creation/deletion
  gulp.watch("src/**/*.js", ["build-src"]);
  gulp.watch("angular-app/app/**/*.js", ["build-js-min"]);
  gulp.watch("angular-app/app/**/*.css", ["build-css"]);
  gulp.watch("angular-app/app/components/**/*.html", ["build-html"]);
  // this doesn't work for some reason TODO
  // gulp.watch("angular-app/bower_components/**/*", ["build-bower"]);
});
