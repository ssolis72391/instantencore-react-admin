import * as AWS from "aws-sdk";
import * as AWSMock from "aws-sdk-mock";
import * as LambdaTester from "lambda-tester";
import { handler } from "../../src/functions/postOneCard";

AWSMock.setSDKInstance(AWS);

/**
 * @TODO Until we have a proper seed method, you will need to update `body.componentId` to match a value in your database.
 */
describe("postOneCard", () => {
  test.skip("postOneCard response", async () => {
    expect.assertions(2);
    await LambdaTester(handler)
      .event({
        httpMethod: "POST",
        resource: "/cards",
        body: JSON.stringify({
          action: "none",
          componentId: 15,
          visible: true,
          description: "View",
          imageUrl: "",
          title: null,
        }),
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
