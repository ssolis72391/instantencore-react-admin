// deprecated;

// //  todo: rename file
// import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
// import * as Validator from "validatorjs";
// import {
//   DateFilter,
//   FunctionHandler,
//   getDateFilterValues,
//   getManyResult,
//   getWrappedHandler,
//   ValidationError,
// } from "../core";
// import { getManyPrograms } from "../database/getManyPrograms";
// import { getOneProgram } from "../database/getPrograms";
// import { programsHeaders } from "../headers";
// import { validatetRfc3339DateOnlyString } from "../tools";
// import { jsonResult } from "../tools/jsonResult";
// import { validateAPIGatewayProxyEvent } from "../validation";

// const getOneProgramHandler: FunctionHandler = async (
//   event: APIGatewayProxyEvent
// ): Promise<APIGatewayProxyResult> => {
//   validateAPIGatewayProxyEvent(event, "/programs/{id}");

//   const id = +event.pathParameters.id;

//   const record = await getOneProgram(id);
//   if (!record) {
//     return {
//       statusCode: 404,
//       body: null,
//       headers: programsHeaders,
//     };
//   }

//   return jsonResult(record);
// };

// class GetProgramsModel {
//   dateFilter: string;
//   localStartDate: string;
//   localEndDate: string;
//   includeDeleted: boolean;
//   constructor(params: { [x: string]: string }) {
//     this.pageSize = +params["_end"];
//     this.descending = params["_order"] === "DESC";
//     const _sortBy = params["_sort"];
//     if (_sortBy === "dates") {
//       this.sortBy = "localStartDate";
//     } else {
//       this.sortBy = _sortBy;
//     }
//     this.startIndex = +params["_start"];
//     this.freeText = params["_freeText"];
//     this.dateFilter = params["dateFilter"];
//     const includeDeleted = params["includeDeleted"];
//     this.includeDeleted =
//       includeDeleted === "true"
//         ? true
//         : includeDeleted === "false"
//         ? false
//         : false;
//     this.localStartDate = params["localStartDate"];
//     this.localEndDate = params["localEndDate"];
//   }

//   pageSize: number;
//   descending: boolean;
//   sortBy: string;
//   startIndex: number;
//   freeText?: string;
// }

// const getManyProgramsHandler: FunctionHandler = async ({
//   queryStringParameters,
// }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//   const params = { ...queryStringParameters };

//   const validatorRules = {
//     _start: ["numeric", "min:0"],
//     _order: { in: ["ASC", "DESC"] },
//     _sort: [
//       "string",
//       "required",
//       "in:dates,name,title,season,status,localStartDate",
//     ],
//     _end: ["numeric", "min:0"],
//     _freeText: ["string"],
//     dateFilter: ["required", "string", `in:${getDateFilterValues().join(",")}`],
//     localStartDate: `required_if:dateFilter,${DateFilter.Custom}|date|before_or_equal:localEndDate`,
//     localEndDate: `required_if:dateFilter,${DateFilter.Custom}}|date|after_or_equal:localStartDate`,
//     includeDeleted: "boolean",
//   };
//   const validator = new Validator(params, validatorRules);
//   const attribute = {};
//   // ensure `_` is displayed in error message
//   for (const key in validatorRules) {
//     attribute[key] = key;
//   }
//   validator.setAttributeNames(attribute);
//   if (validator.fails()) {
//     throw new ValidationError({
//       errors: validator.errors.errors,
//       key: "validatorjs",
//       type: "model",
//     });
//   }

//   const requestModel = new GetProgramsModel(params);

//   const {
//     dateFilter,
//     descending,
//     localEndDate,
//     localStartDate,
//     pageSize,
//     sortBy,
//     startIndex,
//     freeText,
//     includeDeleted,
//   } = requestModel;

//   validatetRfc3339DateOnlyString(localStartDate);
//   validatetRfc3339DateOnlyString(localEndDate);

//   const now = getCurrentRfc3339DateOnlyString();

//   console.debug({ name: getManyProgramsHandler.name, requestModel, now });

//   const { records, totalCount } = await getManyPrograms({
//     descending,
//     localEndDate: dateFilter === DateFilter.Custom ? localEndDate : undefined,
//     localStartDate:
//       dateFilter === DateFilter.Custom ? localStartDate : undefined,
//     utcEndDateGreaterThan: dateFilter === DateFilter.Future ? now : undefined,
//     utcEndDateLesserThan: dateFilter === DateFilter.Past ? now : undefined,
//     pageSize,
//     sortBy,
//     startIndex,
//     freeText,
//     includeDeleted,
//     useDateRange: dateFilter === DateFilter.Custom,
//   });

//   return await getManyResult(records, totalCount, requestModel);
// };

// export const handler = getWrappedHandler(
//   async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//     const resource = event.resource.replace(/^\/[0-9]+/, "");
//     switch (resource) {
//       case "/programs": {
//         return getManyProgramsHandler(event);
//       }
//       case "/programs/{id}": {
//         return getOneProgramHandler(event);
//       }
//       default:
//         throw new Error(`Resource ${resource} is not recognized`);
//     }
//   }
// );
