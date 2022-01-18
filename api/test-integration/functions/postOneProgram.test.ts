import { PostOneProgramModel } from "api-shared";
import * as LambdaTester from "lambda-tester";
import { FunctionHandlerResult } from "../../src/core";
import { handler } from "../../src/functions/postOneProgram";
import { parseJson } from "../../test-tools";

// AWSMock.setSDKInstance(AWS);

/**
 * @todo move to api-shared
 */
interface InstantEncoreToken {
  /**
   * Client id
   */
  cid: string;
  /**
   * User name
   */
  name: string;
}

describe("postOneProgram", () => {
  test("works", async () => {
    const postModel: PostOneProgramModel = {
      localEndDate: "2021-12-01",
      localStartDate: "2021-12-01",
      timeZone: "America/New_York",
      clientId: 1,
      headerImageUrl: "",
      headerTitle: "A title",
      season: "A season",
    };
    const authToken: InstantEncoreToken = {
      cid: "1",
      name: "Test name",
    };
    const headers = {
      Authorization: `Bearer ${JSON.stringify(authToken)}`,
    };
    await LambdaTester(handler)
      .event({
        httpMethod: "POST",
        resource: "/programs",
        body: JSON.stringify(postModel),
        headers: headers,
      })
      .timeout(10)
      .expectResolve((result) => {
        // Snapshot whole response, allowing any body, to be checked next.
        expect(result).toMatchSnapshot({
          body: expect.any(String),
        });

        // Testing body
        expect(JSON.parse(result.body)).toMatchSnapshot({
          id: expect.any(Number),
        });
      });
  });

  test("fails", async () => {
    const postModel: PostOneProgramModel = {
      localEndDate: "2021-12-01",
      localStartDate: "2021-12-02",
      timeZone: "America/New_York",
      clientId: 1,
      headerImageUrl: "",
      headerTitle: "A title",
      season: "A season",
    };
    const authToken: InstantEncoreToken = {
      cid: "0",
      name: "Test name",
    };
    const headers = {
      Authorization: `Bearer ${JSON.stringify(authToken)}`,
    };
    await LambdaTester(handler)
      .event({
        httpMethod: "POST",
        resource: "/programs",
        body: JSON.stringify(postModel),
        headers: headers,
      })
      .timeout(10)
      .expectResolve(async ({ statusCode, body }: FunctionHandlerResult) => {
        expect(statusCode).not.toBe(201);
        expect(typeof parseJson(body)).toBe("object");
      });
  });
});
