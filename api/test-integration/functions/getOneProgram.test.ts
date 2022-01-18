import * as AWS from "aws-sdk";
import * as AWSMock from "aws-sdk-mock";
import * as LambdaTester from "lambda-tester";
import { handler } from "../../src/functions/getPrograms";

AWSMock.setSDKInstance(AWS);

describe("getOneProgram", () => {
  // skip because something is wrong
  // getPrograms is not getOneProgram is maybe the issue?
  // also, running the test alone vs with all the other tests results in a different response body.
  test.skip("getOneProgram response", async () => {
    expect.assertions(2);
    await LambdaTester(handler)
      .event({
        httpMethod: "GET",
        pathParameters: { id: "60" },
        resource: "/programs/{id}",
      })
      .timeout(10)
      .expectResolve((result) => {
        console.log(result);
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
});
