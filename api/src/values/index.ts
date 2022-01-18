import { ProgramModel, Remove } from "api-shared";

export type ProgramValues = Remove<
  ProgramModel,
  "id" | "source" | "sourceId" | "components"
>;
