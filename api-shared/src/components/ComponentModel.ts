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
import { ComponentDateModel, ComponentStatusKey, StyleKey } from "./core";

export interface ComponentModel extends HasId, HasDeletedAt {
  type: ComponentTypeKey;
  dates?: ComponentDateModel[];
  libraryComponent: boolean;
  cards?: CardModel[];
  ad: boolean;
  style: StyleKey;
  internalName: string;
  title?: string;
  subTitle?: string;
  cardImagePosition?: CardImagePositionKey;
  cardImageSize?: ImageSizeKey;
  visible: boolean;
  maxCards: number;
  viewAllText: string;
  status: ComponentStatusKey;
}

export interface ComponentWithOneCardModel
  extends Remove<ComponentModel, "cards"> {
  card?: CardModel;
}
