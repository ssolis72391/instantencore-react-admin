import { CardModel } from "api-shared";
import { ReadOneByIdModel } from "../core";
import { cardMapper } from "./cardMapper";
import { readOneByIdFactory } from "./factories";
import { Card } from "./models";

export const readOneCard = readOneByIdFactory<
  CardModel,
  ReadOneByIdModel<CardModel>,
  Card
>({
  name: "readOnePage",
  innerReadByOneById: async (model) => {
    const { id } = model;
    const result = await Card.findOne({ where: { id } });
    return result;
  },
  modelMapper: cardMapper.mapModel,
});
