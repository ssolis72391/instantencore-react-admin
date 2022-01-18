import * as AWS from "aws-sdk";
import * as AWSMock from "aws-sdk-mock";
import * as LambdaTester from "lambda-tester";
import { handler } from "../../src/functions/deleteOnePage";

AWSMock.setSDKInstance(AWS);

describe("deleteOnePage", () => {
  test("deleteOnePage response", async () => {
    expect.assertions(2);
    await LambdaTester(handler)
      .event({
        httpMethod: "DELETE",
        pathParameters: { id: "1" },
        resource: "/pages/{id}",
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
});
