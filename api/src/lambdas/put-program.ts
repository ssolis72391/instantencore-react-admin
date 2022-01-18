// todo: uncomment and update implementation
// import { ProgramModel, ProgramStatus, PutOneProgramModel } from "api-shared";
// import {
//   equals,
//   getWrappedHandler,
//   identifier,
//   FunctionHandler,
//   included,
//   object,
//   ofType,
//   required,
//   validate,
// } from "../core";
// import { getOneProgram } from "../database/getPrograms";
// import { updateOneProgram } from "../database/updateOneProgram";
// import { oneProgramHeaders, programsHeaders } from "../headers";
// // import { saveProgramImage } from "../shared";
// import { validatetRfc3339DateOnlyString } from "../tools";
// import { handleImagePayload, HttpMethods } from "./core";

// const putProgram: FunctionHandler = async (event) => {
//   validate("event", "event", event, [
//     object({
//       body: required,
//       httpMethod: equals(HttpMethods.PUT),
//       resource: equals("/programs/{id}"),
//       pathParameters: [required, object({ id: identifier })],
//     }),
//   ]);
//   const { body, pathParameters } = event;
//   const model: PutOneProgramModel = JSON.parse(body);
//   const id = +pathParameters.id;
//   const {
//     orgId,
//     localEndDate,
//     localStartDate,
//     name,
//     notes,
//     preTitle,
//     status,
//     subTitle,
//     timeZone,
//     title,
//     season,
//   } = model;

//   validate(
//     "model",
//     "body",
//     model,
//     object<PutOneProgramModel>({
//       orgId: [required, identifier],
//       imageUrl: [required, ofType("string")],
//       isImageDataUrl: [ofType("boolean")],
//       localEndDate: [required, ofType("string")],
//       localStartDate: [required, ofType("string")],
//       name: [required, ofType("string")],
//       preTitle: [ofType("string")],
//       subTitle: [ofType("string")],
//       notes: [ofType("string")],
//       season: [ofType("string")],
//       status: [
//         required,
//         included([ProgramStatus.Draft, ProgramStatus.Published]),
//       ],
//       timeZone: [required, ofType("string")],
//       title: [required, ofType("string")],
//     })
//   );

//   validatetRfc3339DateOnlyString(model.localStartDate);
//   validatetRfc3339DateOnlyString(model.localEndDate);

//   const imageUrl = await handleImagePayload(model);

//   const current = await getOneProgram(id);
//   if (!current) {
//     return {
//       body: JSON.stringify({
//         message: `ProgramModel with id ${id} was not found`,
//       }),
//       statusCode: 404,
//       headers: oneProgramHeaders,
//     };
//   }

//   // let imageUrl: string;
//   // if (image.isDataUrl === true) {
//   //   imageUrl = await saveProgramImage(image);
//   // } else {
//   //   imageUrl = current.imageUrl;
//   // }

//   const updated: ProgramModel = {
//     imageUrl,
//     id,
//     //  todo: calculate the local dates, not the utc ones
//     localEndDate,
//     localStartDate,
//     utcEndDate: localEndDate,
//     utcStartDate: localStartDate,
//     name,
//     notes,
//     preTitle,
//     status,
//     subTitle,
//     timeZone,
//     title,
//     season,
//     orgId,
//   };

//   await updateOneProgram(updated);

//   return {
//     body: JSON.stringify(updated),
//     statusCode: 200,
//     headers: programsHeaders,
//   };
// };

// const handler = getWrappedHandler(putProgram);

// export { handler, putProgram };
