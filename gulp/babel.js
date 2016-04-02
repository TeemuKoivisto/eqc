const gulp = require("gulp"),
  babel = require("gulp-babel");

gulp.task("babel", () =>
  gulp.src("src/**/*.js")
  .pipe(babel({
    presets: ["es2015"]
  }))
  .pipe(gulp.dest("dist/babel/"))
);
