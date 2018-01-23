var webpack = require("webpack");
var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var tsImportPluginFactory = require('ts-import-plugin');

var extractStyles = new ExtractTextPlugin({
    filename: "[name].css"
});

var isProd = false;

var config = {
    devtool: isProd ? false : "source-map",
    entry: {
        "client/garlic": "./src/app.tsx",
    },
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000,
        ignored: ["node_modules/", "client/"]
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".scss", ".json"],
        modules: [path.resolve(__dirname, "module"), path.resolve(__dirname, "data/cache/strings_json"), "node_modules"],
    },
    module: {
        rules: [
            // compile ts/tsx files to js
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader",
            },
            {
                test: /\.scss$/,
                use: extractStyles.extract({
                    use: [
                        {
                            loader: "css-loader",
                            options: {
                                importLoaders: 2,
                                minimize: isProd
                            }
                        },
                        {
                            loader: "sass-loader"
                        }
                    ]
                })
            },
            {
                test:/\.(png|jpe?g|gif|svg)$/,
                exclude:/node_modules/,
                loader: 'url-loader?limit=1024&name=../img/[name].[ext]'
            },
            {
                test: /\.(eot|woff|woff2|ttf)$/,
                exclude: /node_modules/,
                loader: 'url-loader?limit=1024&name=../fonts/[name].[ext]'

            },
        ]
    },
    plugins: [
        extractStyles,

        new webpack.optimize.CommonsChunkPlugin({
            name: "client/vendors",
            minChunks: function(module){
                return module.context && module.context.includes("node_modules");
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "client/manifest"
        })
    ],
    output: {
        path: path.join(__dirname, "."),
        filename: "[name].js",
        chunkFilename: "[name].js"
    },
    target: "electron-renderer"
};

module.exports = config;