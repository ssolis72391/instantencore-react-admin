import { Polly } from "@pollyjs/core";
import { setupPolly } from "setup-polly-jest";
import NodeHttpAdapter from "@pollyjs/adapter-node-http";
import FSPersister from "@pollyjs/persister-fs";
import "regenerator-runtime/runtime.js";

Polly.register(NodeHttpAdapter);
Polly.register(FSPersister);

let context = setupPolly({
  adapters: ["node-http"],
  mode: "record",
  logging: false,
  recordIfMissing: false,
  expiryStrategy: "warn",
  // https://netflix.github.io/pollyjs/#/configuration?id=matchrequestsby
  matchRequestsBy: {
    method: true,
    headers: {
      exclude: ["user-agent", "x-api-key"],
    },
    body: true,
    order: true,
    url: {
      protocol: true,
      username: true,
      password: true,
      hostname: true,
      port: true,
      pathname: false,
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

  server.any().on("beforePersist", ({ recordingName }, recording) => {
    /*
      Removing sensitive data manually because I could not find it built into PollyJS
    */
    const sensitiveWords = ["password"];

    let request = recording.request;

    if (request.postData && request.postData.text) {
      var isSensitive = sensitiveWords.some((sensitiveWord) =>
        request.postData.text.includes(sensitiveWord)
      );
      if (isSensitive) {
        console.log(
          "deleting postData.text that contained a sensitive word: ",
          recordingName
        );
        delete request.postData.text;
      }
    }
  });
});
