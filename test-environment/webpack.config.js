const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const { join } = require("path");


module.exports = {
    entry: "./source/index.js",
    output: {
        path: join(__dirname, "assets"),
        filename: "bundle.js"
    },
    devServer: {
        port: 56789,
        contentBase: "./",
        publicPath: "/assets/"
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
                            "transform-dot-notation-to-props",
                            "transform-react-jsx",
                            "transform-react-display-name"
                        ]
                    }
                }
            },
            {
                test: /.css$/,
                exclude: [join(__dirname, "../lib")],
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader?modules&importLoaders=1&localIdentName=[local]___[hash:base64:8]"
                })
            },
            {
                test: /.css$/,
                include: [join(__dirname, "../lib")],
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            }
        ]
    },
    resolve: {
        alias: {
            ReactConstruct: join(__dirname, "../lib")
        }
    },
    plugins: [
        new webpack.SourceMapDevToolPlugin({}),
        new ExtractTextPlugin("styles.css")
    ]
};
