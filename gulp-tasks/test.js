const gulp = require("gulp");
const { createServer } = require("http");
const { join, sep: separator } = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const MemoryFileSystem = require("memory-fs");
const { spawn } = require("child_process");
const { transformFileSync: transformFile } = require("babel-core");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const vm = require("vm");
const { existsSync: fileExists } = require("fs");


const bundle = { js: "bundle.js", css: "bundle.css" };
const webpackConfig = {
    entry: null,
    output: {
        path: "/",
        filename: bundle.js
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
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
                                        { "default": "ReactDOM", "path": "react-dom" }
                                    ]
                                }
                            ],
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
            rc: getAbsolutePath("lib/")
        }
    },
    plugins: [ new ExtractTextPlugin(bundle.css) ]
};

let shotDownServer = null;

gulp.task("test:client-side-render", done => {
    runServer(({ js, css }) => `
        <meta charset="utf-8">
        <style>${css}</style>
        <div id="application"></div>
        <script>${js}</script>
    `);

    done();
});

gulp.task("test:server-side-render", done => {
    runServer(({ js, css }, filePath) => {
        let Page = getPage(filePath);

        if (!Page) return `can't render Page: ${filePath}`;

        let html = ReactDOMServer.renderToString(React.createElement(Page, null));

        return `
            <meta charset="utf-8">
            <style>${css}</style>
            <div id="application">${html}</div>
            <script> window.isServerSideRendered = true; </script>
            <script>${js}</script>
        `
    });

    done();
});

gulp.task("test:run", () => {
    return new Promise((resolve, reject) => {
        spawn("node", ["node_modules/.bin/jest", "test/"])
            .on("close", () => {
                shotDownServer(resolve);
            });
    });
});

gulp.task("test", gulp.series(
    gulp.series("test:client-side-render", "test:run"),
    gulp.series("test:server-side-render", "test:run")
));


function runServer(getLayout) {
    let server = createServer((request, response) => {
        request.addListener("end", () => {
            if (request.url == "/favicon.ico") return notFound(response);

            let entry = getEntryPoint(request.url);

            if (!fileExists(entry)) return notFound(response);

            let compiler = webpack({ ...webpackConfig, entry });

            let memoryFS = new MemoryFileSystem;

            compiler.outputFileSystem = memoryFS;

            compiler.run((err, stats) => {
                let js = memoryFS.readFileSync("/bundle.js");
                let css = "";

                try {
                    css = memoryFS.readFileSync("/bundle.css");
                } catch (error) { }

                response.writeHead(200, {'Content-Type': 'text/html'});
                response.write(getLayout({ js, css }, entry));
                response.end();
            });
        }).resume();
    });

    server.listen(56789);

    shotDownServer = callback => {
        server.close(() => {
            if (typeof callback == "function") callback();

            shotDownServer = null;
        });
    };
}

function notFound(response) {
    response.writeHead(404);
    response.end();
}

function getAbsolutePath(...paths) {
    return join(process.cwd(), ...paths);
}

function getPage(path) {
    let pagePath = getAbsolutePath(path);
    let context = {
        window: {}, application: null,
        React, ReactDOM: { hydrate: () => {}, render: () => {} }
    };

    return execute(pagePath, context).Page;
}

function execute(path, context={}) {
    let sourceCode = null;

    try {
        let { code } = transformFile(path, {
            presets: ["babel-preset-env"],
            plugins: [
                "syntax-jsx",
                "transform-react-jsx",
                "transform-react-display-name"
            ]
        });

        sourceCode = code;
    } catch (error) {
        console.log("\x1b[31m", `error while compiling: ${path}`, "\x1b[0m");
        // console.log(error);
    }

    if (!sourceCode) return;

    let exports = {};
    let module = { exports };
    let executionContext = { require: getRequire(path), module, exports, ...context };

    vm.createContext(executionContext);

    try {
        vm.runInContext(sourceCode, executionContext);
    } catch (error) {
        console.log("\x1b[31m", `error while running: ${path}`, "\x1b[0m");
        // console.log(error);
    }

    return module.exports;
}

function getRequire(filePath) {
    return function (path) {
        if (path == "react") return React;

        if (/\.css$/.test(path)) return;

        if (/^rc\//.test(path)) {
            let [, modulePath] = path.match(/^rc\/(.+)/);

            let absolutePath = getAbsolutePath("lib/", /\.js$/.test(modulePath) ? modulePath : modulePath + ".js");

            return execute(absolutePath);
        }

        if (/^\./.test(path)) {
            let basenamePosition = filePath.lastIndexOf(separator);
            let dirName = filePath.substring(0, basenamePosition);
            let absolutePath = join(dirName, path);

            return execute(absolutePath);
        }

        return require(path);
    };
}

function getEntryPoint(url) {
    if (url.indexOf("/") > 0) {
        return `./test${url}.js`;
    }

    let name = url.substring(1);

    return `./test/${name}/${name}.js`;
}
