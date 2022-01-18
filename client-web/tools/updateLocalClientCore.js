#!/usr/bin/env node
/**
 * This script is used to consume a local version of client core for rapid development. It should only be used to iterate quickly locally.
 * After running this command package.json will reference a *.tgz file for @instantencore/digital-program-book.
 * This is ok, because it is not expected that the changes to package.json will checked into source control.
 * Once local development is done revert back to using the proper @instantencore/digital-program-book artifact from the npm private repo.
 */
const fs = require("fs");
const execSync = require("child_process").execSync;

// build and pack client-core
execSync("cd ../client-core && yarn build && yarn pack", { stdio: "inherit" });

// rename the file with a hash so that it's unique. This will force yarn to update the package. Otherwise it will use the cached value of the package.
const hash = new Date().getTime();
const newPath = `../client-core/instantencore-digital-program-book-v1.0.${hash}.tgz`;
fs.renameSync(
  "../client-core/instantencore-digital-program-book-v1.0.0.tgz",
  newPath
);

// Add the new pack
execSync(`yarn add ${newPath}`, { stdio: "inherit" });

// Clean up the *.tgz file.
fs.rmSync(newPath);
