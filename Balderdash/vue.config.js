const path = require("path");

module.exports = {
    publicPath: '/',
    outputDir: path.resolve(__dirname, "wwwroot"),
    indexPath: path.resolve(__dirname, "wwwroot", "index.html"),
    chainWebpack: config => {
        config.plugin('html').tap(args => {
            args[0].template = path.resolve(__dirname, "src", "static", "index.html");
            return args;
        });
    },
    devServer: {
        target: 'https://localhost:44342',
        ws: true,
        ssl: true
    }
}