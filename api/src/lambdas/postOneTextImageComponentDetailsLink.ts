// deprecated. commented to salvage any value and later delete

// import {
//   PostTextImageComponentDetailsLinkModel,
//   TextImageComponentDetailsLinkModel,
// } from "api-shared";
// import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
// import fetch from "node-fetch";
// import { HTMLElement, parse } from "node-html-parser";
// import { LambdaHandler } from "../core";
// import { createOneTextImageComponentDetailsLink } from "../database/createOneTextImageComponentDetailsLink";
// import { validateAPIGatewayProxyEvent, validateBody } from "../validation";
// import { getWrappedHandler, postOkResponse } from "./core";

// type LinkMetas = "image" | "title" | "url" | "description";

// function getMetaContent(
//   rootElement: HTMLElement,
//   meta: LinkMetas
// ): Promise<string> {
//   const element = rootElement.querySelector(`meta[property="og:${meta}"]`);
//   if (!element) {
//     console.warn(`Meta ${meta} was not found`);
//   }
//   return Promise.resolve(element?.getAttribute("content"));
// }

// export async function getModelFromMetaContent(
//   url: string
// ): Promise<
//   Omit<TextImageComponentDetailsLinkModel, "id" | "textImageComponentId">
// > {
//   const html = await fetch(url).then((response) => response.text());
//   const root = parse(html);

//   const [subTitle, imageUrl, title, urlFromMeta] = await Promise.all([
//     getMetaContent(root, "description"),
//     getMetaContent(root, "image"),
//     getMetaContent(root, "title"),
//     getMetaContent(root, "url"),
//   ]);

//   return {
//     title,
//     //  let's always return an url
//     url: urlFromMeta || url,
//     imageUrl,
//     subTitle,
//   };
// }

// const postOneTextImageComponentDetailsLink: LambdaHandler = async (
//   event: APIGatewayProxyEvent
// ): Promise<APIGatewayProxyResult> => {
//   validateAPIGatewayProxyEvent({
//     event,
//     httpMethod: "PUT",
//     resource: "/text-image-component-details-links",
//   });

//   const { body } = event;
//   const model: PostTextImageComponentDetailsLinkModel = JSON.parse(body);
//   const { textImageComponentId, url } = model;

//   validateBody(model, {
//     url: ["required", "url"],
//   });

//   const createModel = {
//     ...(await getModelFromMetaContent(url)),
//     textImageComponentId,
//   };

//   if (!createModel.title) {
//     createModel.title = url;
//   }

//   const id = +(await createOneTextImageComponentDetailsLink(createModel));

//   return postOkResponse({ id });
// };

// const handler = getWrappedHandler(postOneTextImageComponentDetailsLink);

// export { handler, postOneTextImageComponentDetailsLink };
