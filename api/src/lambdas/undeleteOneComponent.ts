// deprecated. commented to salvage any value and later delete

// import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
// import { getWrappedHandler } from "../core";
// import { restoreOneComponent } from "../database/restoreOneComponent";
// import { validateAPIGatewayProxyEvent } from "../validation";
// import { defaultHeaders, DefaultHeaders } from "./core";

// async function undeleteOneComponent(
//   event: APIGatewayProxyEvent
// ): Promise<APIGatewayProxyResult> {
//   validateAPIGatewayProxyEvent({
//     event,
//     httpMethod: "POST",
//     resource: "/components/{id}/undelete",
//   });

//   const id = +event.pathParameters.id;
//   await restoreOneComponent(id);

//   return undeleteResponse();
// }

// //  todo: move to shared
// function undeleteResponse(): APIGatewayProxyResult {
//   const headers: DefaultHeaders = {
//     ...defaultHeaders,
//     "Access-Control-Allow-Methods": "POST",
//   };
//   return {
//     statusCode: 204,
//     body: null,
//     headers,
//   };
// }

// const handler = getWrappedHandler(undeleteOneComponent);

// export { handler, undeleteOneComponent };
