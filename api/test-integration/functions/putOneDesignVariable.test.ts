import { DesignVariableModel } from "api-shared";
import * as AWS from "aws-sdk";
import * as AWSMock from "aws-sdk-mock";
import * as LambdaTester from "lambda-tester";
import { handler } from "../../src/functions/putOneDesignVariable";
import { getMockAuthorizationHeader } from "./helpers/getMockAuthorizationHeader";

AWSMock.setSDKInstance(AWS);

describe("putOneDesignVariable", () => {
  test("putOneDesignVariable response", async () => {
    const headers = getMockAuthorizationHeader();
    const designVariableModel: DesignVariableModel = {
      id: 3,
      name: "name here",
      orderIndex: 1,
      type: "color",
      defaultValue: "#000",
      description: "Some description here",
      value: "#fff",
    };
    await LambdaTester(handler)
      .event({
        headers: headers,
        body: JSON.stringify(designVariableModel),
        pathParameters: {
          id: designVariableModel.id,
        },
      })
      .timeout(10)
      .expectResolve((result) => {
        console.log(result);
        expect(result.statusCode).toBe(200);
        expect(result.body).toBeTruthy();
        const response = JSON.parse(result.body);
        console.log("response:", response);
        expect(response.id).toEqual(designVariableModel.id);
        expect(result.headers).toBeTruthy();
        expect(result.headers["Access-Control-Allow-Methods"]).toEqual(
          "GET,OPTIONS,PUT"
        );
        expect(result.headers["Access-Control-Allow-Origin"]).toEqual("*");
      });
  });
});
