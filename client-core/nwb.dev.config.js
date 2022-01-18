module.exports = {
  type: "react-component",
  browsers: ["last 2 chrome versions", "last 2 safari versions"],
  npm: {
    esModules: false,
    cjs: false,
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
    rules: {
      svg: { name: "media/[name].[ext]" },
      fonts: { name: "media/[name].[ext]" },
    },
  },
};
