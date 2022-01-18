var path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const digitalProgramBookComponent = require("@instantencore/digital-program-book/package.json");

// App files location
const PATHS = {
  src: path.resolve(__dirname, "src"),
  dist: path.resolve(__dirname, "dist"),
};

module.exports = (env) => {
  return {
    devServer: {
      hot: true,
      historyApiFallback: true,
    },
    entry: {
      main: "./src/empty.js",
    },
    output: {
      filename: "empty.js",
      path: PATHS.dist,
    },
    plugins: [
      new HtmlWebpackPlugin({
        basepath: `/${digitalProgramBookComponent.name}/${digitalProgramBookComponent.version}/`,
        template: "src/index.html",
        inject: false,
        minify: {
          removeComments: false,
          collapseWhitespace: false,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: false,
          minifyCSS: false,
          minifyURLs: false,
        },
      }),
      env.development
        ? new CopyPlugin({
            patterns: [{ from: "static/favicon.ico", to: "[name][ext]" }],
          })
        : new CopyPlugin({
            patterns: [{ from: "static/favicon.ico", to: "[name][ext]" }],
          }),
      new CopyPlugin({
        patterns: [
          {
            from: `${digitalProgramBookComponent.main}`,
            to: `${digitalProgramBookComponent.name}/${digitalProgramBookComponent.version}/[name][ext]`,
            context: `node_modules/${digitalProgramBookComponent.name}/`,
          },
          {
            from: `${digitalProgramBookComponent.style}`,
            to: `${digitalProgramBookComponent.name}/${digitalProgramBookComponent.version}/[name][ext]`,
            context: `node_modules/${digitalProgramBookComponent.name}/`,
          },
          // {
          //   from: `umd/media/`,
          //   to: `${digitalProgramBookComponent.name}/${digitalProgramBookComponent.version}/media/`,
          //   context: `node_modules/${digitalProgramBookComponent.name}/`,
          // },
          {
            from: `umd/public/`,
            to: `public/`,
            context: `node_modules/${digitalProgramBookComponent.name}/`,
          },
        ],
      }),
    ],
  };
};
