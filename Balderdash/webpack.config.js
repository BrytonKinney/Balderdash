const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("./node_modules/html-webpack-plugin/typings");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: "./frontend/src/index.ts",
    output: {
        path: path.resolve(__dirname, "wwwroot", "js"),
        filename: "[name].js",
        publicPath: "/"
    },
    resolve: {
        extensions: [".js", ".ts"]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader"
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./frontend/src/pages/index.html"
        }),
        new MiniCssExtractPlugin({
            filename: "css/[name].css"
        }),
        new CleanWebpackPlugin()
    ]
};