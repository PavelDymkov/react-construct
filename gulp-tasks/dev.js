const gulp = require("gulp");
const { join, basename } = require("path");
const { getLibFilePaths, buildJs } = require("./deploy.js");
const { copy } = require("fs-extra");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const { createServer } = require("http");
const Static = require("node-static");


gulp.task("dev:lib-watching", () => {
    let libFilesWatcher = gulp.watch("./source/*/*.js");

    libFilesWatcher.on("add", libFileRebuild);
    libFilesWatcher.on("change", libFileRebuild);

    let rootFilesWatcher = gulp.watch("./source/*.js");

    rootFilesWatcher.on("add", rootFileRebuild);
    rootFilesWatcher.on("change", rootFileRebuild);

    let cssFilesWatcher = gulp.watch("./source/*/*.css");

    cssFilesWatcher.on("add", copyCssFile);
    cssFilesWatcher.on("change", copyCssFile);

    return Promise.resolve();
});

gulp.task("dev:webpack", done => {
    const compiler = webpack({
        entry: "./development/index.js",
        output: {
            path: join(process.cwd(), "development/assets/"),
            filename: "bundle.js"
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: ["babel-preset-env"],
                            plugins: [
                                [
                                    "auto-import",
                                    {
                                        "declarations": [
                                            { "default": "React", "path": "react" },
                                            { "default": "ReactDOM", "path": "react-dom" },
                                            { "default": "PropTypes", "path": "prop-types" },
                                            { "default": "styles", "path": "./styles.css" }
                                        ]
                                    }
                                ],
                                "transform-class-properties",
                                "syntax-jsx",
                                "transform-react-statements",
                                "transform-react-jsx",
                                "transform-react-display-name"
                            ]
                        }
                    }
                },
                {
                    test: /.css$/,
                    exclude: [join(process.cwd(), "lib/")],
                    use: ExtractTextPlugin.extract({
                        fallback: "style-loader",
                        use: "css-loader?modules&importLoaders=1&localIdentName=[local]___[hash:base64:8]"
                    })
                },
                {
                    test: /.css$/,
                    include: [join(process.cwd(), "lib")],
                    use: ExtractTextPlugin.extract({
                        fallback: "style-loader",
                        use: "css-loader"
                    })
                }
            ]
        },
        resolve: {
            alias: {
                rc: join(process.cwd(), "lib")
            }
        },
        plugins: [
            new webpack.SourceMapDevToolPlugin({}),
            new ExtractTextPlugin("bundle.css")
        ]
    });

    compiler.watch(null, (error, stats) => {
        if (error) throw error;

        if (stats.hasErrors()) {
            console.log(stats.toString());
        } else {
            const FgGreen = "\x1b[32m";
            const Reset = "\x1b[0m";

            console.log(FgGreen, `development compiled: ${new Date}`, Reset);
        }
    });

    done();
});

gulp.task("dev:server", done => {
    const file = new Static.Server("./development/");

    createServer((request, response) => {
        request.addListener("end", () => {
            file.serve(request, response);
        }).resume();
    }).listen(56789);

    done();
});

gulp.task("dev", gulp.series("deploy", "dev:lib-watching", gulp.parallel("dev:webpack", "dev:server")));


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
