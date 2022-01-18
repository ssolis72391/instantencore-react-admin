require("dotenv").config();
import SentryCliPlugin from "@sentry/webpack-plugin";
import fs from "fs";
import path from "path";
import TerserPlugin from "terser-webpack-plugin";
import { lambdaPrefixes } from "./webpack-core";

/** @type {import('webpack').Configuration} */
const configurationBase = {
  stats: {
    colors: true,
  },
  target: "node",
  resolve: {
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
        test: /\.ts$/,
        include: [path.resolve(__dirname, "src")],
        use: [
          "cache-loader",
          {
            loader: "ts-loader",
            options: {
              transpileOnly: false,
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: false,
    minimizer: [
      new TerserPlugin({
        test: /\.[tj]s(\?.*)?$/i,
        parallel: true,
        terserOptions: {
          sourceMap: true,
          keep_fnames: true,
          output: {
            comments: false,
          },
          compress: true,
        },
        extractComments: false,
      }),
    ],
  },
  devtool: false,
};
module.exports = fs
  .readdirSync(path.join(__dirname, "./src/functions"))
  .filter((filename) =>
    lambdaPrefixes.some(
      (prefix) => filename.startsWith(prefix) && /\.ts$/.test(filename)
    )
  )
  .map((filename) => {
    const name = filename.replace(".ts", "");
    const entry = path.join(__dirname, "./src/functions/", filename);
    const output = {
      path: path.join(__dirname, "dist"),
      libraryTarget: "commonjs2",
      filename: filename.replace(".ts", ".js"),
    };
    const configuration = { ...configurationBase, entry, output };
    return configuration;
  });
