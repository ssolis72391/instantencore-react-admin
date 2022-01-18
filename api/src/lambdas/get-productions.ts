// import fetch, { Response } from "node-fetch";
// import {
//   equals,
//   getManyResult,
//   loggerFactory,
//   object,
//   validate,
// } from "../core";
// import { getWrappedHandler, Handler, HttpMethods } from "../functions/core";

// const { LIVE_NOTE_API_BASE_PATH, BYPASS_SECRET } = process.env;

// interface LiveNoteEvent {
//   title: string;
//   dates: string[];
//   image: string;
//   source: string;
//   sourceId: string;
//   season: string;
// }

// export interface ProductionModel {
//   id: string;
//   title: string;
//   dates: string[];
//   imageUrl: string;
//   season: string;
// }

// interface GetLiveNoteEventResponse {
//   events: LiveNoteEvent[];
// }

// function hasJsonContent(response: Response) {
//   return response.headers.get("Content-Type").includes("application/json", 0);
// }

// export const getProductions: Handler = async (event) => {
//   const logger = loggerFactory("getProductions");

//   validate(
//     "event",
//     "event",
//     event,
//     object({
//       resource: equals("/productions"),
//       httpMethod: equals(HttpMethods.GET),
//     })
//   );

//   const response = await fetch(`${LIVE_NOTE_API_BASE_PATH}/events/5173164`, {
//     headers: { "x-bypass-secret": BYPASS_SECRET },
//   });
//   if (!hasJsonContent(response)) {
//     logger.error(
//       "Api response is not JSON. Follows content as text:\r\n" +
//         (await response.text())
//     );
//     throw Error("Unexpected gateway response");
//   }

//   const { events } = (await response.json()) as GetLiveNoteEventResponse;

//   return await getManyResult(
//     events.map(
//       ({ source, sourceId, dates, image, title, season }) =>
//         ({
//           season,
//           title,
//           dates,
//           imageUrl: image,
//           id: `${source}-${sourceId}`,
//         } as ProductionModel)
//     ),
//     events.length
//   );
// };

// export const handler = getWrappedHandler(getProductions);
