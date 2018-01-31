process.chdir(__dirname);

const gulp = require("gulp");

require("./gulp-tasks/deploy");
require("./gulp-tasks/dev");
require("./gulp-tasks/test");


gulp.task("default", gulp.series("deploy"));
