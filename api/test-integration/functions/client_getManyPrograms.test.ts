import { APIGatewayProxyEvent } from "aws-lambda";
import * as AWS from "aws-sdk";
import * as AWSMock from "aws-sdk-mock";
import * as LambdaTester from "lambda-tester";
import { handler } from "../../src/functions/client-getManyPrograms";

// See sql script in `api/src/database/tools/seed-integration-tests.sql` to seed the database when running this test.

AWSMock.setSDKInstance(AWS);

describe("data transformation", () => {
  test("client-getManyPrograms response", async () => {
    const event = ({
      queryStringParameters: {
        cid: "1",
      },
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

        const bodyResults = JSON.parse(result.body) as Array<any>;
        bodyResults.forEach((bodyResult) => {
          expect(bodyResult).toMatchSnapshot({
            title: expect.any(String),
            programSummaries: expect.any(Array),
          });

          // nested array
          bodyResult.programSummaries.forEach((programSummary) => {
            expect(programSummary).toMatchSnapshot({
              id: expect.any(Number),
              header: expect.any(Object),
            });
          });
        });
      });
  });
});
