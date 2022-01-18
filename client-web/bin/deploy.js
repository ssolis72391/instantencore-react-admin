"use strict";

const execFile = require("child_process").execFile;
const sandbox = process.argv[2] || "copper";
const dist = process.argv[3] || "./dist";
const bucket =
  sandbox == "production"
    ? `dpb-web-instantencore-com`
    : `dpb-web-${sandbox}-instantencore-com`;

// upload to s3 the application and all static assets
execFile(
  "aws",
  [
    "s3",
    "sync",
    `${dist}`,
    `s3://${bucket}/`,
    "--acl",
    "public-read",
    "--metadata-directive",
    "REPLACE",
    "--cache-control",
    "max-age=604800",
    "--exclude",
    "*",
    "--include",
    "@instantencore/**/*",
    "--include",
    "favicon.ico",
  ],
  (error, stdout, stderr) => {
    if (error) {
      console.error("Sync failed: ", stderr);
      process.exit(1);
    }
    console.log(`Sync ${bucket} success.\r\n`, stdout);
  }
);

const files = ["index.html"];

const awsCopy = (
  src,
  target,
  options = ["--acl", "public-read", "--cache-control", "no-cache, no-store"]
) => {
  return new Promise((resolve, reject) => {
    execFile(
      "aws",
      ["s3", "cp", src, target].concat(options),
      (error, stdout, stderr) => {
        if (error) {
          reject(error + stderr);
        }
        resolve(stdout);
      }
    );
  });
};

Promise.all(files.map((src) => awsCopy(`${dist}/${src}`, `s3://${bucket}/`)))
  .then(function (results) {
    results.forEach(function (item) {
      console.log(`Copy ${bucket} success.\r\n`, item);
    });
  })
  .catch(function (err) {
    console.log("Copy failed:", err);
    process.exit(1);
  });
