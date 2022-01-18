require("dotenv").config();
import fs from "fs";
import path from "path";
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
  plugins: [],
  mode: "development",
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
    minimizer: [],
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
    const configuration = { ...configurationBase, entry, output, name };
    return configuration;
  });
