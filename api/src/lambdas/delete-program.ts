// import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
// import { getWrappedHandler } from "../core";
// import { deleteProgramFromDatabase } from "../database/deleteProgramFromDatabase";

// const handler = getWrappedHandler(
//   async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//     const id = +event.pathParameters.id;
//     await deleteProgramFromDatabase(id);
//     return {
//       statusCode: 200,
//       body: JSON.stringify({ id }),
//       // todo: move to common
//       headers: {
//         "Access-Control-Allow-Headers": "Content-Type",
//         "Access-Control-Allow-Origin": "*",
//         "Access-Control-Allow-Methods": "OPTIONS,GET,POST,DELETE",
//       },
//     };
//   }
// );

// export { handler };
