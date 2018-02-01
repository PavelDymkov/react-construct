const gulp = require("gulp");
const { createServer } = require("http");
const { join, dirname, isAbsolute } = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const MemoryFileSystem = require("memory-fs");
const { spawn } = require("child_process");
const { transformFileSync: transformFile } = require("babel-core");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const vm = require("vm");


const webpackConfig = {
    entry: null,
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
                            /*[
                                "auto-import",
                                {
                                    "declarations": [
                                        { "default": "React", "path": "react" },
                                        { "default": "ReactDOM", "path": "react-dom" },
                                        { "default": "PropTypes", "path": "prop-types" },
                                        { "default": "styles", "path": "./styles.css" }
                                    ]
                                }
                            ],*/
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
        // new webpack.SourceMapDevToolPlugin({}),
        new ExtractTextPlugin("bundle.css")
    ]
};

let shotDownServer = null;

gulp.task("test:client-side-render", done => {
    createServer((request, response) => {
        request.addListener("end", () => {
            // request, response;
            // debugger
            let entry = "./test/modal/modal.js";
            let compiler = webpack({ entry, ...webpackConfig});

            compiler.outputFileSystem = new MemoryFileSystem;

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

gulp.task("test:server-side-render", done => {
    let Page = getPage("./test/modal/modal.js");
    let html = ReactDOMServer.renderToString(React.createElement(Page, null));

    runServer("./test/modal/modal.js", ({ js, css }) => `
        <meta charset="utf-8">
        <style>${css}</style>
        <div id="application">${html}</div>
        <script> window.isServerSideRendered = true; </script>
        <script>${js}</script>
    `);

    done();
});

gulp.task("test:run", done => {
    spawn("node", ["node_modules/.bin/jest", "test/"])
        .on("close", code => {
            console.log(`child process exited with code ${code}`);
        });
});

gulp.task("test", gulp.series("test:server-side-render"));


function runServer(entry, getLayout) {
    createServer((request, response) => {
        request.addListener("end", () => {
            // request, response;
            // debugger
            let compiler = webpack({ entry, ...webpackConfig});

            let memoryFS = new MemoryFileSystem;

            compiler.outputFileSystem = memoryFS;

            compiler.run((err, stats) => {
                let js = memoryFS.readFileSync("/bundle.js");
                let css = "";

                try {
                    css = memoryFS.readFileSync("/bundle.css");
                } catch (error) { }

                response.writeHead(200, {'Content-Type': 'text/html'});
                response.write(getLayout({ js, css }));
                response.end();
            });
        }).resume();
    }).listen(56789);
}

function getPage(path) {
    let pagePath = join(process.cwd(), path);
    let { code } = transformFile(pagePath, {
        presets: ["babel-preset-env"],
        plugins: [
            "transform-class-properties",
            "syntax-jsx",
            "transform-react-statements",
            "transform-react-jsx",
            "transform-react-display-name"
        ]
    });

    let context = {
        require: requireStub.bind({ dirname: dirname(pagePath) }),
        window: {}, application: null,
        React, ReactDOM: { hydrate: () => {}, render: () => {} }
    };

    vm.createContext(context);
    vm.runInContext(code, context);

    return context.Page;
}

function execute(path, requireStub) {
    let { code } = transformFile(path, {
        presets: ["babel-preset-env"]
    });

    let exports = {}
    let context = { require: requireStub, module: { exports }, exports };

    vm.createContext(context);
    vm.runInContext(code, context);

    return exports;
}

function requireStub(path) {
    if (path == "react") return React;
    if (/\.css$/.test(path)) return;

    if (/^rc\//.test(path)) {
        let [, modulePath] = path.match(/^rc\/(.+)/);

        let absolutePath = join(process.cwd(), "lib/", /\.js$/.test(modulePath) ? modulePath : modulePath + ".js");

        return execute(absolutePath, requireStub.bind({ dirname: dirname(absolutePath) }));
    }

    if (/^\./.test(path) && this.dirname) {
        let absolutePath = join(this.dirname, path);

        return execute(absolutePath, requireStub.bind({ dirname: dirname(absolutePath) }));
    }

    return require(path);
}
