const gulp = require("gulp");
const { basename } = require("path");
const { getLibFilePaths, buildJs } = require("./deploy.js");
const { copy } = require("fs-extra");


gulp.task("dev:watching", () => {
    let libFilesWatcher = gulp.watch("./source/*/*.js");

    libFilesWatcher.on("add", delay(libFileRebuild));
    libFilesWatcher.on("change", delay(libFileRebuild));

    let rootFilesWatcher = gulp.watch("./source/*.js");

    rootFilesWatcher.on("add", delay(rootFileRebuild));
    rootFilesWatcher.on("change", delay(rootFileRebuild));

    let cssFilesWatcher = gulp.watch("./source/*/*.css");

    cssFilesWatcher.on("add", delay(copyCssFile));
    cssFilesWatcher.on("change", delay(copyCssFile));

    return Promise.resolve();
});

gulp.task("dev", gulp.series("deploy", "dev:watching"));


function libFileRebuild(filePath) {
    let [sourceFilePath, destinationFilePath] = getLibFilePaths(filePath);

    return buildJs(sourceFilePath, destinationFilePath).then(console.log).catch(console.log);
}

function rootFileRebuild(filePath) {
    let fileName = basename(filePath);

    return buildJs(filePath, `./lib/${fileName}`).then(console.log).catch(console.log);
}

function copyCssFile(filePath) {
    let [sourceFilePath, destinationFilePath] = getLibFilePaths(filePath);

    return copy(sourceFilePath, destinationFilePath);
}

function delay(fn) {
    return function (filePath) {
        return new Promise(resolve => {
            setTimeout(() => {
                fn(filePath).then(resolve);
            }, 200);
        });
    }
}
