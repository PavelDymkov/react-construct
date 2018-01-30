const gulp = require("gulp");
const glob = require("glob");
const { join, sep: separator, basename } = require("path");
const { readFile: read, outputFile: write, copy } = require("fs-extra");
const del = require("del");
const { transform } = require("babel-core");



gulp.task("deploy:clean-before", () => {
    return del(["lib/!*", "!lib/!*.json"]);
});

gulp.task("deploy", gulp.parallel("deploy:clean-before"));


gulp.task("default", gulp.series("deploy"));

/*
gulp.task("deploy", ["deploy:clean-before", "deploy:js", "deploy:copy"]);

gulp.task("deploy:clean-before", done => {
    del(["lib/!*", "!lib/!*.json"], done);
});

gulp.task("deploy:js", ["deploy:build-js", "deploy:build-root-js"]);

gulp.task("deploy:build-js", () => {
    return new Promise((resolve, reject) => {
        glob("./source/!*!/!*.js", (error, jsFiles) => {
            if (error) reject(error);

            jsFiles.forEach(async filePath => {
                let [sourceFilePath, destinationFilePath] = getShiftedPath(filePath);

                await buildJs(sourceFilePath, destinationFilePath);
            });

            resolve();
        });
    });
});

gulp.task("deploy:build-root-js", () => {
    return new Promise((resolve, reject) => {
        glob("./source/!*.js", (error, jsFiles) => {
            if (error) reject(error);

            jsFiles.forEach(async filePath => {
                let fileName = basename(filePath);

                await buildJs(filePath, `./lib/${fileName}`);
            });

            resolve();
        });
    });
});

gulp.task("deploy:copy", ["deploy:copy-css", "deploy:copy-md"]);

gulp.task("deploy:copy-css", () => {
    return new Promise((resolve, reject) => {
        glob("./source/!**!/!*.css", (error, cssFiles) => {
            if (error) reject(error);

            cssFiles.forEach(async filePath => {
                let [sourceFilePath, destinationFilePath] = getShiftedPath(filePath);

                await copy(sourceFilePath, destinationFilePath);
            });

            resolve();
        });
    });
});

gulp.task("deploy:copy-md", () => {
    return gulp.src("README.md").pipe(gulp.dest("lib/"));
});


// gulp.task("publish");


gulp.task("dev", ["dev:lib"]);

gulp.task("dev:lib", ["deploy"], () => {
    console.log("INVOKE!!!");

    gulp.watch("./source/!*!/!*.js", event => {
        if (event.type == "deleted") return;

        let [sourceFilePath, destinationFilePath] = getShiftedPath(event.path);

        buildJs(sourceFilePath, destinationFilePath);
    });

    gulp.watch("./source/!*.js", event => {
        if (event.type == "deleted") return;

        let fileName = basename(event.path);

        buildJs(filePath, `./lib/${fileName}`);
    });
});

gulp.task("default", ["deploy"]);

*/


function getShiftedPath(path) {
    let batches = path.split(separator);
    let relativeFilePath = batches.slice(batches.lastIndexOf("source") + 2).join(separator);

    let sourceFilePath = join(__dirname, path);
    let destinationFilePath = join(__dirname, "lib/", relativeFilePath);

    return [sourceFilePath, destinationFilePath];
}

async function buildJs(sourceFilePath, destinationFilePath) {
    let sourceCode = await read(sourceFilePath);
    let { code } = transform(sourceCode, {
        plugins: [
            [
                "auto-import", {
                "declarations": [
                    { "default": "React", "path": "react" },
                    { "default": "PropTypes", "path": "prop-types" }
                ]
            }
            ],
            "transform-class-properties",
            "syntax-jsx",
            "transform-react-statements",
            "transform-react-jsx",
            "transform-react-display-name"
        ]
    });

    await write(destinationFilePath, code);
}
