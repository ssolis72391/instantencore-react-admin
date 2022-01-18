import resolve from "rollup-plugin-node-resolve";
import globals from "rollup-plugin-node-globals";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import minify from "rollup-plugin-babel-minify";
import json from "rollup-plugin-json";
import pkg from "./package.json";
const copyright = `/*! v${pkg.version} Copyright ${new Date().getFullYear()} ${
  pkg.author
} */`;

export default [
  // browser-friendly UMD build
  {
    input: "src/js/main.js",
    output: {
      name: pkg.name.replace(/[@,\-,/]/g, "_"),
      format: "umd",
      file: pkg.browser,
      sourcemap: true,
      banner: copyright,
      globals: {
        fetch: "fetch",
      },
    },
    plugins: [
      babel({
        exclude: ["node_modules/**"],
      }),
      resolve({
        browser: true,
      }),
      commonjs(),
      globals(),
      json(),
      minify({ comments: false }),
    ],
    onwarn: function (warning) {
      // Suppress this error message... there are hundreds of them. Angular team says to ignore it.
      // https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
      if (warning.code === "THIS_IS_UNDEFINED") {
        return;
      }
      console.error(warning.message); // eslint-disable-line no-console
    },
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // the `output` array option
  {
    input: "src/js/main.js",
    external: ["browser-or-node", "cross-fetch/polyfill"],
    output: [
      {
        file: pkg.main,
        sourcemap: true,
        format: "cjs",
        banner: copyright,
      },
      {
        file: pkg.module,
        sourcemap: true,
        format: "es",
        banner: copyright,
      },
    ],
    plugins: [
      json(),
      babel({
        exclude: ["node_modules/**"],
      }),
      minify({ comments: false }),
    ],
  },
];
