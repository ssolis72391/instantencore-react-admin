import { loggerFactory, object2, ofType, truthy, validate } from "../../core";
import {
  UpdateOneById,
  UpdateOneByIdFactoryArgs,
  UpdateOneByIdModel,
} from "../../core/database";
import { id, object } from "../../core/validation";

export function updateOneByIdFactory<
  Model,
  InnerModel,
  TUpdateOneByIdModel extends UpdateOneByIdModel<Model> = UpdateOneByIdModel<Model>,
  InnerUpdateOneByIdModel extends UpdateOneByIdModel<InnerModel> = UpdateOneByIdModel<InnerModel>
>(
  args: UpdateOneByIdFactoryArgs<
    Model,
    InnerModel,
    TUpdateOneByIdModel,
    InnerUpdateOneByIdModel
  >
): UpdateOneById<
  Model,
  InnerModel,
  TUpdateOneByIdModel,
  InnerUpdateOneByIdModel
> {
  validate("args", "argument", args, object2(args, { name: truthy() }));
  const logger = loggerFactory("updateOneByIdFactory");

  const {
    name,
    updateOneByIdModelValidator,
    innerUpdateOneByIdModelMapper,
    innerUpdateOneById,
  } = args;

  validate(
    "args",
    "argument",
    args,
    object2(args, {
      name: truthy(),
      innerUpdateOneById: [truthy(), ofType("function")],
      innerUpdateOneByIdModelMapper: [truthy(), ofType("function")],
    })
  );

  const updateOneById: UpdateOneById<
    Model,
    InnerModel,
    TUpdateOneByIdModel,
    InnerUpdateOneByIdModel
  > = async (model) => {
    const logger = loggerFactory(name);

    validate(
      "model",
      "model",
      model,
      updateOneByIdModelValidator
        ? Array.isArray(updateOneByIdModelValidator)
          ? updateOneByIdModelValidator
          : [object2(model, updateOneByIdModelValidator)]
        : [
            truthy(),
            object({
              model: [truthy(), ofType("object")],
              id: id(),
            }),
          ]
    );

    const innerUpdateOneByIdModel = innerUpdateOneByIdModelMapper(model);
    if (!innerUpdateOneByIdModel.logger) {
      innerUpdateOneByIdModel.logger = logger;
    }

    const result = await innerUpdateOneById(innerUpdateOneByIdModel);

    return result;
  };
  return updateOneById;
}
