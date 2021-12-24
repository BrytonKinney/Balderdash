const path = require("path");

module.exports = {
    publicPath: '/',
    outputDir: path.resolve(__dirname, "wwwroot"),
    indexPath: path.resolve(__dirname, "wwwroot", "index.html"),
    configureWebpack: {
        entry: {
            app: "./frontend/src/main.ts"
        },
        resolve: {
            extensions: [".vue", ".js", ".ts"]
        },
        module: {
            rules: [
                { test: /\.vue$/, loader: "vue-loader" }
            ]
        }
    },
    chainWebpack: config => {
        config.plugin('html').tap(args => {
            args[0].template = path.resolve(__dirname, "frontend", "src", "static", "index.html");
            return args;
        });
    }
}