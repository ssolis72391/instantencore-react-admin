// deprecated. commented to salvage any value and later delete

// import {
//   PutOneTextImageComponentDetailsLinkModel,
//   TextImageComponentDetailsLinkModel,
// } from "api-shared";
// import { equals, object, required } from "../core";
// import { updateOneTextImageComponentDetailsLink } from "../database/updateOneTextImageComponentDetailsLink";
// import {
//   getWrappedHandler,
//   handleImagePayload,
//   HttpMethods,
//   putOneHandlerFactory,
// } from "./core";
// import { HandlerNames } from "./HandlerNames";

// export const putOneTextImageComponentDetailsLink = putOneHandlerFactory<
//   PutOneTextImageComponentDetailsLinkModel,
//   Omit<TextImageComponentDetailsLinkModel, "textImageComponentId">
// >({
//   name: HandlerNames.putOneTextImageComponentDetailsLink,
//   eventValidators: [
//     object({
//       httpMethod: equals(HttpMethods.PUT),
//       body: required,
//       resource: equals("/text-image-component-details-links/{id}"),
//     }),
//   ],
//   putOneModelValidators: [
//     object<PutOneTextImageComponentDetailsLinkModel>({
//       id: required,
//     }),
//   ],
//   mapper: async ({ id, title, url, imageUrl, isImageDataUrl, subTitle }) => {
//     return {
//       id,
//       url,
//       imageUrl: await handleImagePayload({ imageUrl, isImageDataUrl }),
//       subTitle,
//       title,
//     };
//   },
//   dal: updateOneTextImageComponentDetailsLink,
// });

// export const handler = getWrappedHandler(putOneTextImageComponentDetailsLink);
