const gulp = require("gulp");
const nodemon = require("gulp-nodemon");
const livereload = require("gulp-livereload");

gulp.task("nodemon", ["watch-all"], () => {
  nodemon({
    script: "index.js",
    ext: "js html css",
    ignore: ["src/**/*.js", "gulp", "test"]
  }).on("restart", () => {
    livereload.reload();
    console.log("server restart");
  });
});
