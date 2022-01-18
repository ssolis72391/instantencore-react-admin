// deprecated. commented to salvage any value and later delete

// import { readOneTextImageComponentDetails } from "../database/readOneTextImageComponentDetails";
// import {
//   getWrappedHandler,
//   Handler,
//   notFound,
//   okResult,
//   validateAPIGatewayProxyEvent,
// } from "./core";

// export const getOneTextImageComponentDetails: Handler = async (event) => {
//   validateAPIGatewayProxyEvent({
//     event,
//     httpMethod: "GET",
//     resource: "/text-image-component-details/{id}",
//   });

//   const id = +event.pathParameters.id;

//   const record = await readOneTextImageComponentDetails(id);
//   if (!record) {
//     return notFound();
//   }

//   return okResult(record);
// };

// export const handler = getWrappedHandler(getOneTextImageComponentDetails);
