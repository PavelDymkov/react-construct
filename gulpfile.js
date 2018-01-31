const gulp = require("gulp");
const glob = require("glob");
const { join, sep: separator, basename } = require("path");
const { readFile: read, outputFile: write, copy } = require("fs-extra");
const del = require("del");
const { transform } = require("babel-core");


process.chdir(__dirname);


gulp.task("deploy:clean-before", () => {
    return del(["lib/*", "!lib/*.json"]);
});

gulp.task("deploy:build-lib-js", () => {
    return new Promise((resolve, reject) => {
        glob("./source/*/*.js", (error, jsFiles) => {
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
        glob("./source/*.js", (error, jsFiles) => {
            if (error) reject(error);

            jsFiles.forEach(async filePath => {
                let fileName = basename(filePath);

                await buildJs(filePath, `./lib/${fileName}`);
            });

            resolve();
        });
    });
});

gulp.task("deploy:copy-css", () => {
    return new Promise((resolve, reject) => {
        glob("./source/*/*.css", (error, cssFiles) => {
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

gulp.task("deploy:js", gulp.parallel("deploy:build-lib-js", "deploy:build-root-js"));
gulp.task("deploy:copy", gulp.parallel("deploy:copy-css", "deploy:copy-md"));

gulp.task("deploy", gulp.series("deploy:clean-before", gulp.parallel("deploy:js", "deploy:copy")));


gulp.task("dev:lib", gulp.series("deploy", () => {
    let libFilesWatcher = gulp.watch("./source/*/*.js");

    libFilesWatcher.on("add", libFileRebuild);
    libFilesWatcher.on("change", libFileRebuild);

    let rootFilesWatcher = gulp.watch("./source/*.js");

    rootFilesWatcher.on("add", rootFileRebuild);
    rootFilesWatcher.on("change", rootFileRebuild);


    function libFileRebuild(filePath) {
        let [sourceFilePath, destinationFilePath] = getShiftedPath(filePath);

        buildJs(sourceFilePath, destinationFilePath);
    }

    function rootFileRebuild(filePath) {
        let fileName = basename(filePath);

        buildJs(filePath, `./lib/${fileName}`);
    }
}));

gulp.task("dev", gulp.series("dev:lib"));


gulp.task("default", gulp.series("deploy"));


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
