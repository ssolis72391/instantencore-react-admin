import { PutOneProgramModel, TimeZoneProvider } from "api-shared";
import { equals } from "../core";
import { id } from "../core/validation";
import { updateOneProgram } from "../database/updateOneProgram";
import { ProgramValues } from "../values";
import { getWrappedHandler, storeAndOrGetImageUrl, toUtc } from "./core";
import { putOneFactory } from "./factories";

export const putOneProgram = putOneFactory<PutOneProgramModel, ProgramValues>({
  name: "putOneProgram",
  eventValidators: { resource: equals("/programs/{id}") },
  putOneModelMapper: (event) => ({
    ...JSON.parse(event.body),
    id: +event.pathParameters.id,
  }),
  putOneModelValidators: {
    id: id(),
  },
  updateOneModelMapper: async ({
    headerImageSize,
    headerTextPosition,
    headerImageUrl,
    headerPreTitle,
    headerSubTitle,
    id,
    internalName,
    localEndDate,
    localStartDate,
    status,
    headerTitle,
    internalNotes,
    season,
    venue,
    timeZone,
  }) => {
    const { currentOffset } = TimeZoneProvider.getOne(timeZone);

    return {
      id,
      model: {
        headerImageSize,
        headerTextPosition,
        internalName,
        localEndDate,
        localStartDate,
        status,
        timeZone,
        utcEndDate: toUtc(localEndDate, currentOffset),
        utcStartDate: toUtc(localStartDate, currentOffset),
        /**
         * @todo simplify this
         */
        headerImageUrl:
          headerImageUrl !== undefined
            ? headerImageUrl !== null
              ? await storeAndOrGetImageUrl(headerImageUrl)
              : null
            : undefined,
        headerPreTitle,
        headerSubTitle,
        headerTitle,
        internalNotes,
        season,
        venue,
      },
    };
  },
  updateOne: updateOneProgram,
});

export const handler = getWrappedHandler(putOneProgram);
