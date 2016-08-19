const gulp = require("gulp");
const nodemon = require("gulp-nodemon");
const livereload = require("gulp-livereload");

gulp.task("start", ["watch:all"], () => {
  nodemon({
    script: "index.js",
    ext: "js html css jpg png",
    ignore: ["src/**/*", "angular-app/**/*", "dist/**/*", "gulp", "test", "e2e"]
  }).on("restart", () => {
    livereload.reload();
    console.log("server restart");
  });
});
