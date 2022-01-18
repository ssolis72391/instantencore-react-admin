import { ErrorResult, getWrappedHandler } from "../../src/core";

describe("getWrappedHandler", () => {
  it("returns right error response", async () => {
    const { statusCode, body: errorResultJson } = await getWrappedHandler(
      () => {
        throw 1;
      }
    )({ httpMethod: "GET", resource: "/" });
    const { errorMessage, errorType, message, trace } = ErrorResult.parse(
      errorResultJson
    );

    expect(statusCode).toEqual(500);
    expect(errorMessage).toEqual(message);
    expect(message).toEqual("1");
    expect(errorType).toEqual("GenericError");
    expect(trace).toBeTruthy();
  });
});
