// todo: uncomment and update implementation
// import { ComponentModel } from "api-shared";
// import { equals, identifier, object, required, Validator } from "../core";
// import { readOneComponent } from "../database/readOneComponent";
// import { getOneFactory, getWrappedHandler, HttpMethods } from "./core";
// import { HandlerNames } from "./HandlerNames";

// export const getOneComponent = getOneFactory<ComponentModel>({
//   eventValidators: object({
//     resource: equals("/components/{id}"),
//     // future usage //
//     // resource: equals("/components/{type}/{id}"),
//     httpMethod: equals(HttpMethods.GET),
//     pathParameters: [
//       required,
//       object<{ id: string; type: string }>({
//         id: identifier,
//         // future usage //
//         // type: included(ComponentTypeMap.keysArray),
//       }) as Validator,
//     ],
//   }),
//   name: HandlerNames.getOneComponent,
//   dal: readOneComponent,
// });

// export const handler = getWrappedHandler(getOneComponent);
