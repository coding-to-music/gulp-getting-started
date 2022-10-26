"use strict";

var gulp = require("gulp");
var imagemin = require("gulp-imagemin");

function defaultTask(cb) {
  // place code for your default task here
  cb();
}

exports.default = defaultTask;

// const { series } = require("gulp");

// // The `clean` function is not exported so it can be considered a private task.
// // It can still be used within the `series()` composition.
// function clean(cb) {
//   // body omitted
//   cb();
// }

// // The `build` function is exported so it is public and can be run with the `gulp` command.
// // It can also be used within the `series()` composition.
// function build(cb) {
//   // body omitted
//   cb();
// }

// exports.build = build;
// exports.default = series(clean, build);

// const { parallel } = require("gulp");

// function javascript(cb) {
//   // body omitted
//   cb();
// }

// function css(cb) {
//   // body omitted
//   cb();
// }

// exports.build = parallel(javascript, css);

const { src, dest } = require("gulp");

exports.default = function () {
  return src("src/*.js").pipe(dest("output/"));
};

var baseDir = "./src";
var targetDir = "./output";
gulp.task("imagemin", function () {
  return gulp
    .src(baseDir + "/assets/*")
    .pipe(
      imagemin([
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
      ])
    )
    .pipe(gulp.dest(targetDir + "/images"));
});
