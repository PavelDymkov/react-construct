const gulp = require("gulp");
const { createServer } = require("http");
const { join, dirname } = require("path");
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
            rc: join(process.cwd(), "lib/")
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

/*gulp.task("test", gulp.series("test:client-side-render"));*/
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
        server.close(callback);
    };
}

function notFound(response) {
    response.writeHead(404);
    response.end();
}

function getPage(path) {
    let pagePath = join(process.cwd(), path);
    let { code } = transformFile(pagePath, {
        presets: ["babel-preset-env"],
        plugins: [
            "syntax-jsx",
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
        presets: ["babel-preset-env"],
        plugins: [
            "syntax-jsx",
            "transform-react-jsx",
            "transform-react-display-name"
        ]
    });

    let exports = {};
    let module = {  exports};
    let context = { require: requireStub, module, exports };

    vm.createContext(context);
    vm.runInContext(code, context);

    return module.exports;
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

function getEntryPoint(url) {
    if (url.indexOf("/") > 0) {
        return `./test${url}.js`;
    }

    let name = url.substring(1);

    return `./test/${name}/${name}.js`;
}
