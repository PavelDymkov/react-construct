process.chdir(__dirname);

const gulp = require("gulp");

require("./gulp-tasks/deploy");
require("./gulp-tasks/dev");


gulp.task("default", gulp.series("deploy"));
