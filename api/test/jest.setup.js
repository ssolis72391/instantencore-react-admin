import * as Sentry from "@sentry/serverless";
import * as dotenv from "dotenv";
dotenv.config();
global.Sentry = Sentry;
jest.mock("@sentry/serverless");
jest.mock("@sentry/tracing");

// Polly.register(HttpAdapter);
// Polly.register(FSPersister);

// const context = setupPolly({
//   adapters: ["node-http"],
//   mode: "replay",
//   logging: false,
//   recordIfMissing: false,
//   expiryStrategy: "warn",
//   // https://netflix.github.io/pollyjs/#/configuration?id=matchrequestsby
//   matchRequestsBy: {
//     method: true,
//     headers: {
//       exclude: ["user-agent"],
//     },
//     body: true,
//     order: true,
//     url: {
//       protocol: true,
//       username: true,
//       password: true,
//       hostname: true,
//       port: true,
//       pathname: true,
//       query: true,
//       hash: true,
//     },
//   },
//   persister: "fs",
//   persisterOptions: {
//     fs: {
//       recordingsDir: "./test/__recordings__",
//     },
//   },
// });

jest.setTimeout(120000); // 120 second timeout

process.env["AWS_REGION"] = "us-west-1";
