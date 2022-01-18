import * as AWS from "aws-sdk";
import * as AWSMock from "aws-sdk-mock";
import * as LambdaTester from "lambda-tester";
import { handler } from "../../src/functions/getOneCard";

AWSMock.setSDKInstance(AWS);

describe("getOneCard", () => {
  /**
   * @TODO ensure there is a card first, enable and update ss
   */
  test.skip("getOneCard response", async () => {
    expect.assertions(2);
    await LambdaTester(handler)
      .event({
        httpMethod: "GET",
        pathParameters: { id: "45" },
        resource: "/cards/{id}",
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
          action: expect.any(String),
          id: expect.any(Number),
          componentId: expect.any(Number),
          description: expect.any(String),
          title: expect.any(Object), // Object since nullable
          page: expect.any(Object), // Object since nullable
          pageId: expect.any(Number),
          orderIndex: expect.any(Number),
          url: expect.any(Object), // Object since nullable
          visible: expect.any(Boolean),
          imageUrl: expect.any(String),
        });
      });
  });
});
