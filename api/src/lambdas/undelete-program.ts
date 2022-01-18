// import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
// import {
//   equals,
//   getWrappedHandler,
//   identifier,
//   object,
//   required,
//   validate,
// } from "../core";
// import { unDeleteProgramFromDatabase } from "../database/unDeleteProgramFromDatabase";
// import { HttpMethods } from "../functions/core";

// export const handler = getWrappedHandler(
//   async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//     validate("event", "event", event, [
//       required,
//       object({
//         httpMethod: equals(HttpMethods.POST),
//         resource: equals("/programs/{id}"),
//         pathParameters: object({ id: identifier }),
//       }),
//     ]);

//     const id = +event.pathParameters.id;
//     await unDeleteProgramFromDatabase(id);
//     return {
//       statusCode: 204,
//       body: null,
//       // todo: move to common
//       headers: {
//         "Access-Control-Allow-Headers": "Content-Type",
//         "Access-Control-Allow-Origin": "*",
//         "Access-Control-Allow-Methods": "OPTIONS,GET,POST,DELETE",
//       },
//     };
//   }
// );
