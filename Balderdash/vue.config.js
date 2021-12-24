const path = require("path");

module.exports = {
    publicPath: '/',
    outputDir: path.resolve(__dirname, "wwwroot"),
    indexPath: path.resolve(__dirname, "wwwroot", "index.html"),
    configureWebpack: {
        entry: "./frontend/src/index.ts",
        resolve: {
            extensions: [".js", ".ts", ".vue"]
        },
        module: {
            rules: [
                { test: /\.vue$/, loader: "vue-loader" },
                //{
                //    test: /\.ts$/,
                //    loader: "ts-loader",
                //    options: { appendTsSuffixTo: [/\.vue$/] }
                //}
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