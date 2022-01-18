import { ComponentTypeKey } from "./components";
import {
  HasId,
  HasOrderIndex,
  ImageSizeKey,
  NamedCollection,
  Remove,
} from "./core";
import { PageModel } from "./pages";

export type CardImagePositionKey = "left" | "right" | "top" | "bottom";
export const CardImagePositionCollection = new NamedCollection<
  CardImagePositionKey,
  string
>({ bottom: "Bottom", left: "Left", right: "Right", top: "Top" } as const);

export interface CardModel extends HasId, HasOrderIndex {
  componentId: number;
  action: CardActionKey;
  url?: string;
  page?: PageModel;
  pageDescription?: string;
  pageId?: number;
  imageUrl?: string;
  title?: string;
  description?: string;
  visible?: boolean;
}

/**
 * @todo rename to CardHelper
 */
export class ComponentCardHelper {
  private static readonly singleCardComponentTypes: ComponentTypeKey[] = [
    "html",
    "image",
    "text",
    "thumbnail",
  ];
  private static readonly compatibleTypeMap: ComponentTypeKey[][] = [
    ["text", "image", "thumbnail"],
    ["verticalList", "horizontalList", "textList"],
    ["html"],
  ];
  private static readonly cardImageSizeMap: Record<
    ComponentTypeKey,
    ImageSizeKey[]
  > = {
    thumbnail: ["cover", "contain"],
    horizontalList: [],
    html: [],
    image: ["cover", "contain", "full"],
    text: [],
    textList: [],
    verticalList: ["cover", "contain"],
  };
  private static readonly cardImagePositionMap: Record<
    ComponentTypeKey,
    CardImagePositionKey[]
  > = {
    thumbnail: ["left", "right"],
    horizontalList: ["left", "right"],
    html: [],
    image: ["top", "bottom"],
    text: [],
    textList: [],
    verticalList: ["left", "right"],
  };
  static isSingleCard(componentType: ComponentTypeKey) {
    return this.singleCardComponentTypes.includes(componentType);
  }
  static isMultiCard(componentType: ComponentTypeKey) {
    return !this.isSingleCard(componentType);
  }
  static canSwitchOver(from: ComponentTypeKey, to: ComponentTypeKey) {
    if (from === to) {
      return true;
    }
    return !!this.compatibleTypeMap.find(
      (array) => array.includes(from) && array.includes(to)
    );
  }
  static getCardImageSizes(type: ComponentTypeKey) {
    return this.cardImageSizeMap[type];
  }
  static getCardImagePositions(type: ComponentTypeKey) {
    return this.cardImagePositionMap[type];
  }
  static getCompatibleTypes(
    type: ComponentTypeKey,
    excludeTypeFromResult = false
  ) {
    const types = this.compatibleTypeMap.find((array) => array.includes(type));
    if (types && excludeTypeFromResult) {
      const index = types.indexOf(type);
      delete types[index];
    }
    return types || [];
  }

  /**
   * Translates the component.type stored in the DB (and set by the cms) into the Card Type used by the client core.
   * @param type component.type used by the CMS
   */
  static getClientCardType(type: ComponentTypeKey) {
    switch (type) {
      case "horizontalList":
        return "horizontal";
      case "textList":
        return "simple";
      case "html":
        return "html";
      case "image":
      case "text":
      case "thumbnail":
      case "verticalList":
        return "standard";
      default:
        return "standard";
    }
  }
}

export type CardActionKey = "none" | "link" | "page";
const CardAction: Record<CardActionKey, string> = {
  none: "None",
  link: "Link",
  page: "Page",
} as const;
export const CardActionCollection = new NamedCollection(CardAction);

export type PostOneCardModel = Remove<CardModel, "url" | "pageId" | "page">;
export type PostOneCardWithLinkActionModel = PostOneCardModel &
  Pick<CardModel, "url">;

/**
 * @todo enhace this
 */
export type PutOneCardModel = CardModel;
