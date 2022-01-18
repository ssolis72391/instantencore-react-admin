const SentryCliPlugin = require("@sentry/webpack-plugin");
const fs = require("fs");
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const pkg = require("./package.json");
require("dotenv").config();

/**
 * @todo import `webpack-core.js`
 * @type {import('webpack').Configuration}
 * */
module.exports = {
  entry: fs
    .readdirSync(path.join(__dirname, "./src/functions"))
    .filter((filename) => /\.[jt]s$/.test(filename))
    .map((filename) => {
      const entry = {};
      entry[filename.replace(/.[tj]s$/, "")] = path.join(
        __dirname,
        "./src/functions/",
        filename
      );
      return entry;
    })
    .reduce((finalObject, entry) => Object.assign(finalObject, entry), {}),
  output: {
    path: path.join(__dirname, "dist"),
    libraryTarget: "commonjs2",
    filename: "[name].js",
  },
  stats: {
    colors: true,
  },
  target: "node",
  resolve: {
    symlinks: false,
    extensions: [".js", ".ts"],
  },
  externals: ["aws-sdk", "pg-hstore"],
  plugins: [
    new SentryCliPlugin({
      enable: process.env.SENTRY_AUTH_TOKEN ? true : false,
      org: process.env.SENTRY_ORGANIZATION,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      include: [path.resolve(__dirname, "dist")],
    }),
  ],
  mode: "production",
  module: {
    rules: [
      {
        test: /\.[tj]s$/,
        include: [path.resolve(__dirname, "src")],
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  devtool: "source-map",
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.[tj]s(\?.*)?$/i,
        terserOptions: {
          keep_fnames: true,
          output: {
            comments: true,
          },
        },
      }),
    ],
  },
};
