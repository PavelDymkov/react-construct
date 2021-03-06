const gulp = require("gulp");
const glob = require("glob");
const { join, sep: separator, basename } = require("path");
const { readFile: read, outputFile: write, copy } = require("fs-extra");
const del = require("del");
const { transform } = require("babel-core");


gulp.task("deploy:clean-before", () => {
    return del(["lib/*", "!lib/*.json"]);
});

gulp.task("deploy:build-lib-js", () => {
    return new Promise((resolve, reject) => {
        glob("./source/*/*.js", (error, jsFiles) => {
            if (error) reject(error);

            jsFiles.forEach(async filePath => {
                let [sourceFilePath, destinationFilePath] = getLibFilePaths(filePath);

                await buildJs(sourceFilePath, destinationFilePath).catch(console.log);
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

                await buildJs(filePath, `./lib/${fileName}`).catch(console.log);
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
                let [sourceFilePath, destinationFilePath] = getLibFilePaths(filePath);

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


module.exports = { getLibFilePaths, buildJs };

function getLibFilePaths(path) {
    let parts = path.split(separator);

    parts = parts.slice(parts.lastIndexOf("source") + 1);

    let [directory, fileName] = parts;
    let tester = new RegExp(`^${directory || ""}.(js|css)$`);

    if (tester.test(fileName)) {
        parts = parts.slice(1);
    }

    let relativeFilePath = parts.join(separator);

    let sourceFilePath = join(process.cwd(), path);
    let destinationFilePath = join(process.cwd(), "lib/", relativeFilePath);

    return [sourceFilePath, destinationFilePath];
}

function buildJs(sourceFilePath, destinationFilePath) {
    return new Promise(async (resolve, reject) => {
        let sourceCode = await read(sourceFilePath);

        try {
            let {code} = transform(sourceCode, {
                plugins: [
                    [
                        "auto-import", {
                        "declarations": [
                            {"default": "React", "path": "react"},
                            {"default": "PropTypes", "path": "prop-types"},
                            {"default": "BaseComponent", "path": getRootPathFor("base-component", destinationFilePath)},
                            {"default": "KeyCode", "path": getRootPathFor("key-codes", destinationFilePath)}
                        ]
                        }
                    ],
                    "transform-class-properties",
                    ["transform-object-rest-spread", { "useBuiltIns": true }],
                    "syntax-jsx",
                    "transform-react-statements",
                    "transform-react-jsx",
                    "transform-react-display-name"
                ]
            });

            await write(destinationFilePath, code);

            resolve(`compiled: ${sourceFilePath}`);
        } catch (error) {
            let address = error.loc ? ` (${error.loc.line}:${error.loc.column})` : "";

            reject(`compile error:\n    at ${sourceFilePath}${address}`);
        }
    });
}

function getRootPathFor(fileName, destinationFilePath) {
    let parts = destinationFilePath.split(separator);
    let depth = (parts.length - 1) - (parts.lastIndexOf("lib") + 1);

    if (depth == 0) return `./${fileName}.js`;

    if (depth < 0) throw new Error;

    return `${ [...Array(depth)].map(() => "..").join("/") }/${fileName}.js`;
}
