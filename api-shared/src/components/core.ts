import { Remove } from "../core";
import { CardActionKey, CardImagePositionKey, CardModel } from "../cards";
import {
  HasDeletedAt,
  HasId,
  HasOrderIndex,
  ImageSizeKey,
  NamedCollection,
  OmitId,
} from "../core";
import { ComponentTypeKey } from "./component-type";
import { ComponentModel } from "./ComponentModel";

export type CreateOrAdd = "create" | "add";

export const CreateOrAddCollection = new NamedCollection<CreateOrAdd, string>({
  add: "Add from Library",
  create: "Create",
});

export type CreateOrAddCoreModel<CoA extends CreateOrAdd> = {
  pageOrProgramId: number;
  createOrAdd: CoA;
};

export type PostCreateComponentModel = Pick<
  ComponentModel,
  "internalName" | "type" | "visible"
> & {
  /**
   * Should be falsy if component type is list
   */
  card?: Partial<Pick<CardModel, "action" | "url">>;
} & CreateOrAddCoreModel<"create">;

export type PostAddComponentModel = {
  pageOrProgramId: number;
  componentId: number;
} & CreateOrAddCoreModel<"add">;

export type DatesOverrideModeKey = "none" | "show" | "hide";

export type PageComponentModel = {
  pageId: number;
  componentId: number;
  datesOverrideMode: DatesOverrideModeKey;
  component?: ComponentModel;
} & HasId &
  HasOrderIndex;

export type PostOnePageComponentModel = Pick<
  PageComponentModel,
  "componentId"
> & {
  /**
   * @summary alias for page id
   */
  pageOrProgramId: number;
};

export type ComponentStatusKey = "ok" | "deleted";
const ComponentStatus: Record<ComponentStatusKey, string> = {
  deleted: "Deleted",
  ok: "Ok",
} as const;
export const ComponentStatusCollection = new NamedCollection(ComponentStatus);

/**
 * @todo move metadata to ComponentType instances
 */
export class ComponentHelper {
  private static readonly typesThatSupportActions: ComponentTypeKey[] = [
    "horizontalList",
    "image",
    "textList",
    "thumbnail",
    "verticalList",
  ];
  static supportsActions(type: ComponentTypeKey) {
    return this.typesThatSupportActions.includes(type);
  }
}

/**
 * @deprecated use `ComponentTypeMap`
 */
export const ComponentTypeCollection = new NamedCollection<
  ComponentTypeKey,
  string
>({
  text: "Text Card",
  thumbnail: "Thumbnail Card",
  image: "Image Card",
  verticalList: "Vertical Card List",
  horizontalList: "Horizontal Card List",
  html: "HTML",
  textList: "Text List",
});

export interface ComponentDateModel extends HasId {
  componentId?: number;
  localStartDate: string;
  utcStartDate: string;
  localEndDate: string;
  utcEndDate: string;
  timeZone: string;
}
export type StyleKey = "default" | "spotlight";
export const StyleCollection = new NamedCollection<StyleKey, string>({
  default: "Default",
  spotlight: "Spotlight",
});

const ComponentDisplayType: Record<string, string> = {
  always: "Always",
  includeSometimes: "Include sometimes",
  excludeSometimes: "Exclude sometimes",
};
export type ComponentDisplayTypeKey = keyof typeof ComponentDisplayType;
export const ComponentDisplayTypeCollection = new NamedCollection(
  ComponentDisplayType
);
