module.exports = {
  collectCoverage: true,
  coverageDirectory: "./artifacts/coverage",
  coverageReporters: ["json", "html", "cobertura", "text"],
  moduleFileExtensions: ["js", "json", "jsx", "node"],
  moduleNameMapper: {
    "^.+\\.(css|scss|sass|less)$": "<rootDir>/test/jest-stub.js",
  },
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  reporters: ["default", "jest-junit"],
  setupFiles: ["<rootDir>/test/setupTests"],
  setupFilesAfterEnv: ["<rootDir>/test/jest.setup.js"],
  testEnvironment: "jsdom",
  testRegex: "(/test/.(test)*|\\.(test))\\.jsx?$",
  transform: {
    "^.+\\.js$": "<rootDir>/test/jest.transform.js",
  },
};
