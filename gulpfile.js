const gulp = require("gulp");
const glob = require("glob");
const { join, sep: separator } = require("path");
const { copy } = require("fs-extra");
const del = require("del");


gulp.task("deploy", ["deploy:clean-before", "deploy:build-js", "deploy:copy"]);

gulp.task("deploy:clean-before", done => {
    del(["lib/*", "!lib/*.md", "!lib/*.json"], done);
});

gulp.task("deploy:build-js", done => {
    done();
});

gulp.task("deploy:copy", done => {
    glob("./source/**/*.css", (error, cssFiles) => {
        if (error) return;

        cssFiles.forEach(async filePath => {
            let batches = filePath.split(separator);
            let relativeFilePath = batches.slice(batches.lastIndexOf("source") + 2).join(separator);

            let sourceFilePath = join(__dirname, filePath);
            let destinationFilePath = join(__dirname, "lib/", relativeFilePath);

            await copy(sourceFilePath, destinationFilePath);
        });

        done();
    });
});

gulp.task("default", ["deploy"]);
