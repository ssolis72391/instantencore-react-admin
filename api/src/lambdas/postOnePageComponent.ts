// // todo: uncomment and update

// import { OmitId, PostOnePageComponentModel } from "api-shared";
// import { equals, identifier, ofType } from "../core";
// import { getWrappedHandler } from "../functions/core";
// import { postOneFactory } from "../functions/factories";

// export const postOnePageComponent = postOneFactory<
//   PostOnePageComponentModel,
//   OmitId<PageComponentBareModel>
// >({
//   name: "postOnePageComponent",
//   eventValidators: { resource: equals("/page-components") },
//   postOneModelValidators: {
//     visible: ofType("boolean"),
//     pageOrProgramId: identifier,
//     componentId: identifier,
//   },
//   modelMapper: (postOneModel) => ({ ...postOneModel }),
//   //  fake dal
//   createOne: (model) => Promise.resolve(1),
// });

// export const handler = getWrappedHandler(postOnePageComponent);
