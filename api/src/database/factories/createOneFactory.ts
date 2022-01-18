import {
  loggerFactory,
  object,
  ObjectValidators,
  ofType,
  optional,
  required,
  validate,
  Validator,
} from "../../core";
import { CreateOne } from "../../core/database";

type InnerCreateOneResult<Model> = number | Model;

interface CreateOneFactoryArgs<Model, Result> {
  /**
   * @summary used for logging purposes. in a future for caching too.
   */
  name: string;
  /**
   * @summary create one model validation schema or validators
   */
  modelValidation?: ObjectValidators<Model> | Validator<Model>[];
  /**
   * @summary data access layer low implementation
   */
  innerCreateOne: (model: Model) => Promise<number>;
  /**
   * @summary maps the result from the data access layer result
   */
  resultMapper: (innerResult: number) => Result;
}

/**
 * @summary testing
 */
class NamedDictionary<Value> {
  constructor(private record?: Record<string, Value>) {
    if (!this.record) {
      this.record = {};
    }
  }
  getOrAdd(key: string, valueFactory: () => Value) {
    if (this.record[key] === undefined) {
      this.record[key] = valueFactory();
    }
    return this.record[key];
  }
  get(key: string) {
    return this.record[key];
  }
}

export function createOneFactory<Model, Result = number>(
  args: CreateOneFactoryArgs<Model, Result>
): CreateOne<Model, Result> {
  validate(
    "args",
    "argument",
    args,
    object<CreateOneFactoryArgs<Model, Result>>({
      innerCreateOne: required,
      name: required,
      modelValidation: optional((value) =>
        Array.isArray(value) || typeof value === "object"
          ? undefined
          : "Expected a Validator array or an ObjectValidators<Model> object"
      ),
      resultMapper: [required, ofType("function")],
    })
  );

  const logger = loggerFactory("createOneFactory");

  const { innerCreateOne, name, modelValidation, resultMapper } = args;

  logger.debug("Building model validation");
  const validateModel = (model: Model) => {
    const validators: Validator<Model>[] = [];
    if (modelValidation) {
      if (Array.isArray(modelValidation)) {
        modelValidation.forEach((item) => validators.push(item));
      } else if (typeof modelValidation === "object") {
        validators.push(object(modelValidation));
      }
    } else {
      validators.push(required, ofType("object"));
    }
    validate("model", "model", model, validators);
  };

  logger.debug(`Building the CreateOne '${name}'`);
  const createOne: CreateOne<Model, Result> = async (model) => {
    const logger = loggerFactory(name);

    validateModel(model);

    logger.debug("Calling innerCreateOne(entity)");
    const innerResult = await innerCreateOne(model);

    logger.debug("Mapping innerResult");
    const result = resultMapper(innerResult);

    logger.debug("Returning result");
    return result;
  };

  logger.debug(`Done building the CreateOne '${name}'`);

  return createOne;
}
