const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  type: "react-component",
  browsers: ["last 2 chrome versions", "last 2 safari versions"],
  npm: {
    esModules: true,
    umd: {
      global: "DigitalProgramBookComponent",
    },
  },
  webpack: {
    html: {
      template: "demo/src/index.html",
    },
    copy: {
      patterns: [
        {
          from: "public/assets",
          to: "public",
        },
      ],
    },
    extractCSS: {
      filename: "[name].css",
    },
    extra: {
      optimization: {
        minimizer: [
          new OptimizeCSSAssetsPlugin({}),
          new TerserPlugin({
            terserOptions: {
              output: {
                ecma: 5,
                comments: false,
                // Turned on because emoji and regex is not minified properly using default
                // https://github.com/facebook/create-react-app/issues/2488
                ascii_only: true,
              },
            },
            // Use multi-process parallel running to improve the build speed
            // Default number of concurrent runs: os.cpus().length - 1
            parallel: true,
            // Enable file caching
            cache: true,
          }),
        ],
      },
    },
    rules: {
      svg: { name: "media/[name].[ext]" },
      fonts: { name: "media/[name].[ext]" },
    },
  },
};
