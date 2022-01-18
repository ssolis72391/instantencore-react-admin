import { FlatPageComponentModel } from "api-shared";
import { Mapper } from "../core";
import { cardMapper } from "./cardMapper";
import { PageComponent } from "./models";

export const flatPageComponentMapper: Mapper<
  PageComponent,
  FlatPageComponentModel
> = ({ pageId, component, datesOverrideMode, orderIndex }) => {
  const {
    internalName,
    ad,
    id,
    libraryComponent,
    maxCards,
    style,
    type,
    title,
    viewAllText,
    visible,
    cardImagePosition,
    cardImageSize,
    cards,
    status,
    subTitle,
  } = component;
  return {
    ad,
    datesOverrideMode,
    internalName,
    id,
    libraryComponent,
    maxCards,
    style,
    type,
    title,
    viewAllText,
    visible,
    cardImagePosition,
    cardImageSize,
    cards: cards.map(cardMapper.mapModel),
    status,
    subTitle,
    pageId,
    orderIndex,
  };
};
