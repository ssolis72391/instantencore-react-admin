import * as AWS from "aws-sdk";
import * as AWSMock from "aws-sdk-mock";
import * as LambdaTester from "lambda-tester";
import { handler } from "../../src/functions/deleteOneCard";

AWSMock.setSDKInstance(AWS);

/**
 * TODO: Until we have a proper seed method, you will need to update `pathParameters.id` to match a value in your database.
 * You will also need to update your snapshot if you change the id. (add `-u` to command)
 */
describe("deleteOneCard", () => {
  test("deleteOneCard response", async () => {
    expect.assertions(2);
    await LambdaTester(handler)
      .event({
        httpMethod: "DELETE",
        pathParameters: { id: "20" },
        resource: "/cards/{id}",
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
