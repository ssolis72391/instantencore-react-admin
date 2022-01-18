import { CardImagePositionKey } from "../cards";
import { ImageSizeKey } from "../core";

export interface ComponentType {
  readonly description: string;
  readonly supportsAd: boolean;
  readonly isList: boolean;
  readonly supportOneCardOnly: boolean;
  readonly convertibleToTypes: ComponentTypeKey[];
  readonly cardImageSizes: ImageSizeKey[];
  readonly cardImagePositions: CardImagePositionKey[];
}

export type ComponentTypeKey =
  | "text"
  | "thumbnail"
  | "image"
  | "verticalList"
  | "horizontalList"
  | "html"
  | "textList";

export const ComponentTypeMap = new Map<ComponentTypeKey, ComponentType>()
  .set("horizontalList", {
    description: "Horizontal Card List",
    supportsAd: true,
    supportOneCardOnly: false,
    isList: true,
    convertibleToTypes: ["verticalList", "textList"],
    cardImageSizes: [],
    cardImagePositions: [],
  })
  .set("html", {
    description: "HTML",
    supportsAd: true,
    supportOneCardOnly: true,
    isList: false,
    convertibleToTypes: [],
    cardImageSizes: [],
    cardImagePositions: [],
  })
  .set("image", {
    description: "Image Card",
    supportsAd: true,
    supportOneCardOnly: true,
    isList: false,
    convertibleToTypes: ["text", "thumbnail"],
    cardImageSizes: ["cover", "contain", "full"],
    cardImagePositions: ["top", "right"],
  })
  .set("text", {
    description: "Text Card",
    supportsAd: true,
    supportOneCardOnly: true,
    isList: false,
    convertibleToTypes: ["image", "thumbnail"],
    cardImageSizes: [],
    cardImagePositions: [],
  })
  .set("textList", {
    description: "Text List",
    supportsAd: true,
    supportOneCardOnly: false,
    isList: true,
    convertibleToTypes: ["verticalList", "horizontalList"],
    cardImageSizes: [],
    cardImagePositions: [],
  })
  .set("thumbnail", {
    description: "Thumbnail Card",
    supportsAd: true,
    supportOneCardOnly: true,
    isList: false,
    convertibleToTypes: ["text", "image"],
    cardImageSizes: ["cover", "contain"],
    cardImagePositions: ["left", "right"],
  })
  .set("verticalList", {
    description: "Vertical Card List",
    supportsAd: true,
    supportOneCardOnly: false,
    isList: true,
    convertibleToTypes: ["textList", "horizontalList"],
    cardImageSizes: ["cover", "contain"],
    cardImagePositions: ["left", "right"],
  });
