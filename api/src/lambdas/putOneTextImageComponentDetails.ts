// deprecated. commented to salvage any value and later delete
// import { PutOneTextImageComponentDetailsModel } from "api-shared";
// import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
// import { LambdaHandler, storeImage } from "../core";
// import { updateOneTextImageComponentDetails } from "../database/updateOneTextImageComponentDetails";
// import { validateAPIGatewayProxyEvent, validateBody } from "../validation";
// import { getWrappedHandler, putOkResponse } from "./core";

// const putOneTextImageComponentDetails: LambdaHandler = async (
//   event: APIGatewayProxyEvent
// ): Promise<APIGatewayProxyResult> => {
//   validateAPIGatewayProxyEvent({
//     event,
//     httpMethod: "PUT",
//     resource: "/text-image-component-details",
//   });
//   const id = +event.pathParameters.id;
//   const { body } = event;
//   const model: PutOneTextImageComponentDetailsModel = JSON.parse(body);

//   const {
//     imageUrl: modelImageUrl,
//     isImageDataUrl,
//     subTitle,
//     text,
//     title,
//   } = model;

//   validateBody(model, {
//     imagelUrl: ["url"],
//   });

//   const imageUrl =
//     isImageDataUrl === true
//       ? await storeImage(modelImageUrl)
//       : modelImageUrl || null;

//   await updateOneTextImageComponentDetails({
//     id,
//     imageUrl,
//     subTitle,
//     text,
//     title,
//   });

//   return putOkResponse({ id });
// };

// const handler = getWrappedHandler(putOneTextImageComponentDetails);

// export { handler, putOneTextImageComponentDetails };
