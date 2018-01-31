const gulp = require("gulp");
const { basename } = require("path");
const { getLibFilePaths, buildJs } = require("./deploy.js");
const { copy } = require("fs-extra");


gulp.task("dev:lib-watching", () => {
    let libFilesWatcher = gulp.watch("./source/*/*.js");

    libFilesWatcher.on("add", libFileRebuild);
    libFilesWatcher.on("change", libFileRebuild);

    let rootFilesWatcher = gulp.watch("./source/*.js");

    rootFilesWatcher.on("add", rootFileRebuild);
    rootFilesWatcher.on("change", rootFileRebuild);

    let cssFilesWatcher = gulp.watch("./source/*/*.css");

    rootFilesWatcher.on("add", copyCssFile);
    rootFilesWatcher.on("change", copyCssFile);

    return Promise.resolve();
});

gulp.task("dev:run-dev-server", () => {
    console.log("dev:run-dev-server")
});

gulp.task("dev", gulp.series("deploy", "dev:lib-watching", "dev:run-dev-server"));


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
