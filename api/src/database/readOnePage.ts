import { PageModel } from "api-shared";
import { ReadOneByIdModel } from "../core";
import { readOneByIdFactory } from "./factories";
import { Page } from "./models";
import { pageMapper } from "./pageMapper";
import { RemoveSequelizeModelProps } from "./sequelize";

export const readOnePage = readOneByIdFactory<
  PageModel,
  ReadOneByIdModel<PageModel>,
  RemoveSequelizeModelProps<Page, "deletedAt">
>({
  name: "readOnePage",
  innerReadByOneById: async (model) => {
    const { id } = model;
    const result = await Page.findOne({ where: { id } });
    return result;
  },
  modelMapper: pageMapper.mapModel,
});
