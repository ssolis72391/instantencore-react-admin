import { NamedCollection, OmitId, Remove, ValuesEqualsKeys } from "../core";
import { GetManyModel } from "../get-many";
import { PageModel } from "../pages";

export type ProgramSourceKey = "tessitura" | "instant-encore";
const ProgramSource: Record<ProgramSourceKey, string> = {
  "instant-encore": "Instance Encore",
  tessitura: "Tessitura",
} as const;
export const ProgramSourceCollection = new NamedCollection(ProgramSource);

export type ProgramDateFilterKey = "all" | "future" | "past" | "custom";
const ProgramDateFilter: Record<ProgramDateFilterKey, string> = {
  all: "All",
  custom: "Custom",
  future: "Future",
  past: "Past",
};
export const ProgramDateFilterCollection = new NamedCollection(
  ProgramDateFilter
);

export interface ProgramModel extends Remove<PageModel, "status"> {
  //#region deprecated
  /**
   * @deprecated use internalName
   */
  notes?: string;
  /**
   * @deprecated use {@link clientId}
   */
  orgId?: number;
  /**
   * @deprecated use {@link PageModel.headerImageUrl}
   */
  imageUrl?: string;

  /**
   * Internal name used by the organization to identify the program
   */
  //#endregion
  internalNotes?: string;
  /**
   * Season
   */
  season?: string;
  /**
   * Venue
   */
  venue?: string;
  /**
   * Local start date in RFC3339 date-time format
   */
  localStartDate: string;
  /**
   * UTC start date in RFC3339 date-time format
   */
  utcStartDate: string;
  /**
   * Local end date in RFC3339 date-time format
   */
  localEndDate: string;
  /**
   * UTC end date in RFC3339 date-time format
   */
  utcEndDate: string;
  /**
   * Time zone code
   */
  timeZone: string;
  /**
   * @deprecated moved to {@link status}
   */
  isDeleted?: boolean;
  /*
   * Status
   */
  status: ProgramStatusKey;
  /*
   * The source for the production used as template for this program
   */
  source?: ProgramSourceKey;
  /*
   * The Id for the production used as template for this program
   */
  sourceId?: string;
  /**
   * Temporary solution for v1. to be moved to an association
   * @todo remove once an association has been created
   */
  clientId?: number;
}

export type PostOneProgramModel = Pick<
  ProgramModel,
  | "headerTitle"
  | "headerImageUrl"
  | "localStartDate"
  | "localEndDate"
  | "timeZone"
  | "season"
  /**
   * @todo remove. this should not be exposed or setable by the client
   */
  | "clientId"
>;

export type PutOneProgramModel = Pick<
  ProgramModel,
  | "id"
  | "status"
  | "internalName"
  | "localStartDate"
  | "localEndDate"
  | "season"
  | "venue"
  | "internalNotes"
  | "headerImageSize"
  | "headerImageUrl"
  | "headerPreTitle"
  | "headerSubTitle"
  | "headerTextPosition"
  | "headerTitle"
  | "timeZone"
  | "clientId"
>;

export type ProgramStatusKey = "draft" | "published" | "deleted";
export const ProgramStatus: Record<ProgramStatusKey, string> = {
  deleted: "Deleted" as const,
  draft: "Draft",
  published: "Published",
} as const;

export const ProgramStatusCollection = new NamedCollection(ProgramStatus);

export type GetManyProgramsModel = GetManyModel<
  ProgramModel,
  {
    dateFilter?: ProgramDateFilterKey;
    text?: string;
    localStartDate?: string;
    localEndDate?: string;
    deleted?: boolean;
    clientId?: number;
  }
>;

/**
 * @TODO Validate usage or remove
 */
export const ProgramModelKeys: ValuesEqualsKeys<ProgramModel> = {
  headerImageSize: "headerImageSize",
  headerTextPosition: "headerTextPosition",
  id: "id",
  internalName: "internalName",
  localEndDate: "localEndDate",
  localStartDate: "localStartDate",
  status: "status",
  timeZone: "timeZone",
  utcEndDate: "utcEndDate",
  utcStartDate: "utcStartDate",
  components: "components",
  headerImageUrl: "headerImageUrl",
  headerPreTitle: "headerPreTitle",
  headerSubTitle: "headerSubTitle",
  headerTitle: "headerTitle",
  imageUrl: "imageUrl",
  internalNotes: "internalNotes",
  isDeleted: "isDeleted",
  notes: "notes",
  orgId: "orgId",
  season: "season",
  source: "source",
  sourceId: "sourceId",
  venue: "venue",
  clientId: "clientId",
};
