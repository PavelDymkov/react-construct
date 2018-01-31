const gulp = require("gulp");
const { createServer } = require("http");
const { join } = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const MemoryFileSystem = require("memory-fs");
const { spawn } = require("child_process");


let shotDownServer = null;

gulp.task("test:server", done => {
    createServer((request, response) => {
        request.addListener("end", () => {
            // request, response;
            // debugger
            const compiler = webpack({
                entry: "./test/modal/modal.js",
                output: {
                    path: "/",
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
                            use: ExtractTextPlugin.extract({
                                fallback: "style-loader",
                                use: "css-loader"
                            })
                        }
                    ]
                },
                resolve: {
                    alias: {
                        rc: join(process.cwd(), "lib/")
                    }
                },
                plugins: [
                    new webpack.SourceMapDevToolPlugin({}),
                    new ExtractTextPlugin("bundle.css")
                ]
            });

            const memoryFS = new MemoryFileSystem;

            compiler.outputFileSystem = memoryFS;

            compiler.run((err, stats) => {
                let js = memoryFS.readFileSync("/bundle.js");
                let css = "";

                try {
                    css = memoryFS.readFileSync("/bundle.css");
                } catch (error) { }

                response.writeHead(200, {'Content-Type': 'text/html'});
                response.write(`
                    <meta charset="utf-8">
                    <style>${css}</style>
                    <div id="application"></div>
                    <script>${js}</script>
                `);
                response.end();
            });
        }).resume();
    }).listen(56789);

    done();
});

gulp.task("test:run", done => {
    spawn("node", ["node_modules/.bin/jest", "test/"])
        .on("close", code => {
            console.log(`child process exited with code ${code}`);
        });
});

gulp.task("test", gulp.series("test:server", "test:run"));
