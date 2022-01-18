import { APIGatewayProxyEvent } from "aws-lambda";
import * as AWS from "aws-sdk";
import * as AWSMock from "aws-sdk-mock";
import * as LambdaTester from "lambda-tester";
import { handler } from "../../src/functions/client-getOneProgram";

// See sql script in `api/src/database/tools/seed-integration-tests.sql` to seed the database when running this test.

AWSMock.setSDKInstance(AWS);

describe("data transformation", () => {
  test.skip("client-getOneProgram response", async () => {
    expect.assertions(2);
    const event = ({
      pathParameters: { id: 1 },
    } as unknown) as jest.Mocked<APIGatewayProxyEvent>;
    await LambdaTester(handler)
      .event(event)
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
