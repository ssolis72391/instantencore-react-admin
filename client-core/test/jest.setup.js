require("dotenv").config();

import { Polly } from "@pollyjs/core";
import { MODES } from "@pollyjs/utils";
import { setupPolly } from "setup-polly-jest";
import FSPersister from "@pollyjs/persister-fs";
import enableHooks from "jest-react-hooks-shallow";

// by default, hooks do not work with shallow rendering
// pass an instance of jest to `enableHooks()`
enableHooks(jest);

Polly.register(FSPersister);

let context = setupPolly({
  mode: MODES.REPLAY,
  logging: false,
  recordIfMissing: false,
  expiryStrategy: "warn",
  recordFailedRequests: true,
  // https://netflix.github.io/pollyjs/#/configuration?id=matchrequestsby
  matchRequestsBy: {
    method: true,
    headers: {
      exclude: ["user-agent", "x-api-key", "host"],
    },
    body: true,
    order: true,
    url: {
      protocol: true,
      username: true,
      password: true,
      hostname: false,
      port: true,
      pathname: true,
      query: true,
      hash: false,
    },
  },
  persister: "fs",
  persisterOptions: {
    fs: {
      recordingsDir: "./test/__recordings__",
    },
  },
});

beforeEach(async () => {
  const { server } = context.polly;
  server.any().on("beforePersist", (req, recording) => {
    recording.request.headers = recording.request.headers.filter(
      ({ name }) => name !== "x-api-key"
    );
  });
});

jest.setTimeout(60000); // 60 second timeout

global.window = {};
global.window.instantencore = {};
global.window.instantencore.env = {};
