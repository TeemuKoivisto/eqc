const gulp = require("gulp"),
  nodemon = require("gulp-nodemon");

gulp.task("nodemon", ["watch-src"], () => {
  nodemon({
    script: "index.js",
    ext: "js html css",
    ignore: ["src/**/*.js", "gulp", "test"]
  }).on("restart", () => {
    console.log("server restart");
  })
})
