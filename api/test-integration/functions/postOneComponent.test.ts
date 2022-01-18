import { PostCreateComponentModel } from "api-shared";
import { APIGatewayProxyResult } from "aws-lambda";
import * as AWS from "aws-sdk";
import * as AWSMock from "aws-sdk-mock";
import * as LambdaTester from "lambda-tester";
import { handler } from "../../src/functions/postOneComponent";

AWSMock.setSDKInstance(AWS);

/**
 * TODO: Until we have a proper seed method, you will need to update `body.componentId` to match a value in your database.
 * You will also need to update your snapshot if you change the id. (add `-u` to command)
 */
describe("postOneComponent", () => {
  test.skip("postOneComponent response", async () => {
    //expect.assertions(3);
    const postCreateComponentModel: PostCreateComponentModel = {
      createOrAdd: "create",
      internalName: "test",
      pageOrProgramId: 6,
      type: "thumbnail",
      visible: true,
    };
    await LambdaTester(handler)
      .event({
        httpMethod: "POST",
        resource: "/components",
        body: JSON.stringify(postCreateComponentModel),
      })
      .timeout(10)
      .expectResolve((result: APIGatewayProxyResult) => {
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
