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
        https: true,
        publicPath: '/',
        contentBase: path.resolve(__dirname, "wwwroot"),
        hot: true,
        proxy: {
            "": {
                target: 'https://localhost:44342',
                ws: true,
                changeOrigin: true,
                hostRewrite: true
            }
        },
        public: "https://localhost:8080"
    }
}