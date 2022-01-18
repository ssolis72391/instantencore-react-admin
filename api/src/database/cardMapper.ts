import { CardModel } from "api-shared";
import { ModelMapper } from "./core";
import { Card } from "./models";
import { pageMapper } from "./pageMapper";

export const cardMapper: ModelMapper<CardModel, Card> = {
  mapInnerModel(model) {
    const {
      action,
      componentId,
      id,
      orderIndex,
      description,
      imageUrl,
      title,
      url,
      visible,
      pageId,
      page,
    } = model;
    return {
      action,
      componentId,
      id,
      orderIndex,
      description,
      imageUrl,
      title,
      url,
      visible,
      pageId,
      page: page ? pageMapper.mapInnerModel(page) : undefined,
    };
  },
  mapModel: ({
    action,
    componentId,
    id,
    orderIndex,
    description,
    imageUrl,
    title,
    url,
    visible,
    pageId,
    page,
  }) => ({
    action,
    componentId,
    id,
    orderIndex,
    description,
    imageUrl,
    title,
    url,
    visible,
    pageId,
    page: page ? pageMapper.mapModel(page) : null,
  }),
};
