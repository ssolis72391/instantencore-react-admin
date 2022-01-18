import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  equals,
  getWrappedHandler,
  identifier,
  object,
  required,
  validate,
} from "../core";
import { getLatestProgramTimeZone } from "../database/getLatestProgramTimeZone";
import { HttpMethods } from "../functions/core";

const handler = getWrappedHandler(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    validate("event", "event", event, [
      required,
      object<APIGatewayProxyEvent>({
        httpMethod: equals(HttpMethods.GET),
        resource: equals("/users/{id}"),
        pathParameters: object({ id: identifier }),
        headers: object({
          Authorization: (value) =>
            value && value.split(" ")[0] === "Bearer"
              ? undefined
              : "Invalid auth token",
        }),
      }),
    ]);

    const id = +event.pathParameters.id;
    //  dummy auth filter implementation
    const token = JSON.parse(event.headers["Authorization"].split(" ")[1]);
    const defaultTimeZone = await getLatestProgramTimeZone(token.orgId);
    return {
      statusCode: 200,
      //    dummy user implementation
      body: JSON.stringify({ id, defaultTimeZone }),
      // todo: move to common
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,GET",
      },
    };
  }
);

export { handler };
