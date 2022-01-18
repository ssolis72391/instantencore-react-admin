import { ComponentModel } from "api-shared";
import { cardMapper } from "./cardMapper";
import { ModelMapper } from "./core";
import { Component } from "./models";

export const componentMapper: ModelMapper<ComponentModel, Component> = {
  //#endregion
  mapModel({
    ad,
    id,
    internalName,
    libraryComponent,
    maxCards,
    style,
    type,
    viewAllText,
    visible,
    cardImagePosition,
    cardImageSize,
    cards,
    status,
    subTitle,
    title,
  }) {
    return {
      ad,
      id,
      internalName,
      libraryComponent,
      maxCards,
      status,
      style,
      type,
      viewAllText,
      visible,
      cardImagePosition,
      cardImageSize,
      cards: cards?.map(cardMapper.mapModel),
      subTitle,
      title,
    };
  },
  mapInnerModel({
    ad,
    id,
    internalName,
    libraryComponent,
    maxCards,
    style,
    type,
    viewAllText,
    visible,
    cardImagePosition,
    cardImageSize,
    cards,
    status,
    subTitle,
    title,
  }) {
    return {
      ad,
      id,
      internalName,
      libraryComponent,
      maxCards,
      status,
      style,
      type,
      viewAllText,
      visible,
      cardImagePosition,
      cardImageSize,
      cards: cards?.map(cardMapper.mapInnerModel),
      subTitle,
      title,
    };
  },
};
