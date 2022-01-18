//  todo: uncomment and update
// import { equals, httpMethod, object } from "../core";
// import { getManyHandlerFactory } from "../functions/factories";

// // eslint-disable-next-line @typescript-eslint/ban-types
// const getManyComponents = getManyHandlerFactory<{}, {}>({
//   name: "getManyComponents",
//   eventValidator: object({
//     httpMethod: httpMethod("GET"),
//     resource: equals("/components"),
//   }),
//   dal: (args) => {
//     return Promise.resolve({ models: [], totalCount: 0 });
//   },
//   getManyModelMapper: (event) => {
//     return {};
//   },
// });
