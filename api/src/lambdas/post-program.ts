// todo: uncomment and update implementation
// import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
// import { ProgramStatus } from "api-shared";
// import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
// import * as dayjs from "dayjs";
// import * as timezone from "dayjs/plugin/timezone";
// import * as utc from "dayjs/plugin/utc";
// import fetch from "node-fetch";
// import * as uniqid from "uniqid";
// import * as Validator from "validatorjs";
// import { getWrappedHandler } from "../core";
// import { saveProgramToDb } from "../database/save-program-to-db";
// import { programsHeaders } from "../headers";
// import { validatetRfc3339DateOnlyString } from "../tools";
// import { TimeZoneProvider } from "./timeZoneProvider";
// dayjs.extend(utc);
// dayjs.extend(timezone);

// const config = {
//   s3Region: process.env.S3_REGION,
//   s3Bucket: process.env.S3_BUCKET,
//   imageStoreBasePath: process.env.IMAGE_STORE_BASE_PATH,
// };

// // models
// enum ImageDataType {
//   Url = "Url",
//   Base64String = "Base64String",
// }

// interface PostOneProgramImageModel {
//   type: ImageDataType;
//   data: string;
// }

// interface PostOneProgramModel {
//   orgId: number;
//   title: string;
//   season?: string;
//   localStartDate: string;
//   localEndDate: string;
//   timeZone: string;
//   image: PostOneProgramImageModel;
// }

// async function saveImage({
//   data,
//   type,
// }: PostOneProgramImageModel): Promise<string> {
//   const s3 = new S3Client({ region: config.s3Region });

//   let buffer: Buffer;
//   let contentType: string;
//   switch (type) {
//     case ImageDataType.Base64String:
//       buffer = Buffer.from(
//         data.replace(/^data:image\/\w+;base64,/, ""),
//         "base64"
//       );
//       contentType = data?.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0];
//       break;
//     case ImageDataType.Url:
//       const result = await fetch(data);
//       buffer = await result.buffer();
//       contentType = result.headers.get("Content-Type");
//       break;
//     default:
//       throw Error("Unknown image type");
//   }

//   const ext = contentType.replace("image/", "");
//   const key = `${uniqid()}.${ext}`;
//   await s3.send(
//     new PutObjectCommand({
//       Bucket: config.s3Bucket,
//       Key: key,
//       Body: buffer,
//       ContentType: contentType,
//     })
//   );
//   return `${config.imageStoreBasePath}/${key}`;
// }

// //  todo: calculate the local dates, not the utc ones
// function toUtcDate(date: Date, timezone: string) {
//   const utcDate = dayjs(date).tz(timezone);
//   if (utcDate.isValid()) {
//     return utcDate.toDate();
//   } else {
//     throw Error("Invalid UTC date conversion");
//   }
// }

// const handler = getWrappedHandler(
//   async ({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//     const model: PostOneProgramModel = JSON.parse(body);

//     const rules = {
//       orgId: "required|numeric",
//       image: "required",
//       title: "required",
//       localStartDate: "required|date|before_or_equal:localEndDate",
//       localEndDate: "required|date|after_or_equal:localStartDate",
//       timeZone: [
//         "required",
//         "string",
//         `in: ${TimeZoneProvider.get()
//           .map((t) => t.name)
//           .join(",")}}`,
//       ],
//     };

//     //  replace this with a common validation suite/methods
//     const validation = new Validator(model, rules);
//     if (validation.fails()) {
//       //todo: move to common
//       return {
//         body: JSON.stringify({
//           message: "The posted data did not pass validation.",
//           errors: validation.errors.errors,
//         }),
//         statusCode: 400,
//         headers: programsHeaders,
//       };
//     }
//     validatetRfc3339DateOnlyString(model.localStartDate);
//     validatetRfc3339DateOnlyString(model.localEndDate);

//     const {
//       orgId,
//       localEndDate,
//       localStartDate,
//       timeZone,
//       title,
//       season,
//       image,
//     } = model;
//     const imageUrl = await saveImage(image);
//     //  todo: calculate the local dates, not the utc ones

//     const id = await saveProgramToDb({
//       orgId,
//       name: title,
//       localEndDate,
//       utcEndDate: localEndDate,
//       localStartDate,
//       utcStartDate: localStartDate,
//       timeZone,
//       title,
//       season,
//       imageUrl,
//       status: ProgramStatus.Draft,
//     });

//     return {
//       statusCode: 201,
//       headers: programsHeaders,
//       body: JSON.stringify({ id }),
//     };
//   }
// );

// export {
//   saveImage,
//   handler,
//   ImageDataType,
//   PostOneProgramImageModel,
//   PostOneProgramModel,
//   saveProgramToDb,
// };
