import { ProgramModel } from "api-shared";
import { flatPageComponentMapper } from "./flatPageComponentMapper";
import { Program } from "./models";
export const programMapper: (model: Program) => ProgramModel = (model) => {
  if (!model) {
    return undefined;
  }
  const {
    id,
    localEndDate,
    localStartDate,
    status,
    timeZone,
    utcEndDate,
    utcStartDate,
    deletedAt,
    internalNotes,
    season,
    source,
    sourceId,
    venue,
    clientId,
    page: {
      headerImageSize,
      headerTextPosition,
      internalName,
      headerImageUrl,
      headerPreTitle,
      headerSubTitle,
      headerTitle,
      pageComponents,
    },
  } = model;

  return {
    id,
    localEndDate,
    localStartDate,
    status,
    timeZone,
    utcEndDate,
    utcStartDate,
    internalNotes,
    season,
    source,
    sourceId,
    venue,
    headerImageSize,
    headerTextPosition,
    internalName,
    headerImageUrl,
    headerPreTitle,
    headerSubTitle,
    headerTitle,
    components: pageComponents.map(flatPageComponentMapper),

    clientId,
  };
};
