import { DesignVariableModel } from "api-shared";
import * as AWS from "aws-sdk";
import * as AWSMock from "aws-sdk-mock";
import * as LambdaTester from "lambda-tester";
import { handler } from "../../src/functions/getManyDesignVariables";
import { getMockAuthorizationHeader } from "./helpers/getMockAuthorizationHeader";

AWSMock.setSDKInstance(AWS);

describe("getManyDesignVariables", () => {
  test("getManyDesignVariables response", async () => {
    const headers = getMockAuthorizationHeader();
    await LambdaTester(handler)
      .event({
        headers: headers,
      })
      .timeout(10)
      .expectResolve((result) => {
        console.log(result);
        expect(result.statusCode).toBe(200);
        expect(result.body).toBeTruthy();
        const response = JSON.parse(result.body);
        const designVariables = response.models as DesignVariableModel[];
        console.log("designVariables:", designVariables);
        expect(designVariables.length).toEqual(10);
        expect(result.headers).toBeTruthy();
        expect(result.headers["Access-Control-Allow-Methods"]).toEqual(
          "OPTIONS,GET"
        );
        expect(result.headers["Access-Control-Allow-Origin"]).toEqual("*");
      });
  });
});
