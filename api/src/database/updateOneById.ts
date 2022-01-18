import { Model, UpdateOptions } from "sequelize";
import { id, object, ofType, truthy } from "../core";
import { updateOneByIdFactory } from "./factories";
import { PageComponent } from "./models";

type SequelizeModelName = "pageComponent";
const SequelizeModels = new Map<SequelizeModelName, SequelizeModelClass>([
  ["pageComponent", PageComponent],
]);

type SequelizeModelClass = {
  update: <M extends Model>(
    values: Partial<M["_attributes"]>,
    options: UpdateOptions<M["_attributes"]>
  ) => Promise<[number, M[]]>;
};

export const updateOneById = updateOneByIdFactory<
  // eslint-disable-next-line @typescript-eslint/ban-types
  { modelName: SequelizeModelName; modelValues: {} },
  // eslint-disable-next-line @typescript-eslint/ban-types
  { modelName: SequelizeModelName; modelValues: {} }
>({
  name: "updateOne",
  updateOneByIdModelValidator: {
    id: id(),
    model: object({
      modelName: truthy(),
      modelValues: [truthy(), ofType("object")],
    }),
  },
  innerUpdateOneByIdModelMapper: ({ id, model }) => ({
    id,
    model,
  }),
  innerUpdateOneById: async ({ id, model }) => {
    const { modelName, modelValues: values } = model;
    const modelClass = SequelizeModels.get(modelName);
    const result = await modelClass.update(values, { where: { id } });
    return result[0];
  },
});
