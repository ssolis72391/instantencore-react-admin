import {
  FunctionHandler,
  FunctionHandlerEvent,
  FunctionHandlerFactoryArgs,
  getPromise,
  httpMethod,
  loggerFactory,
  object,
  object2,
  ObjectValidators,
  ofType,
  optional,
  required,
  truthy,
  validate,
  Validator,
} from "../../core";
import { CreateOne } from "../../core/database";
import { modelCreatedResult } from "../core";

export interface PostOneFactoryArgs<PostOneModel, Model>
  extends FunctionHandlerFactoryArgs {
  /**
   * @summary maps the postOneModel from the handler event
   */
  postOneModelMapper?: (event: FunctionHandlerEvent) => PostOneModel;
  /**
   * @summary Handler event validator
   * @todo remove Validator<PostOneModel> and replace with Validator<PostOneModel>[]
   */
  postOneModelValidators:
    | ObjectValidators<PostOneModel>
    | Validator<PostOneModel>[];
  /**
   * @summary
   * - PostOneModel to Model mapper
   * - Currently here is where the business logic resides
   */
  modelMapper: (postOneModel: PostOneModel) => Model | Promise<Model>;

  /**
   * Optional validators
   */
  modelValidators?: ObjectValidators<Model> | Validator<Model>[];

  /**
   * @summary DAL
   */
  createOne: CreateOne<Model>;
}

/**
 * @summary just a reference contract, no practical usage yet
 */
export type PostOneHandlerFactory = <PostModel, Model = undefined>(
  args: PostOneFactoryArgs<PostModel, Model>
) => FunctionHandler;

/**
 * @summary factory for post one handlers
 * @returns a FunctionHandler
 * @todo return notfound on no model
 */
export const postOneFactory = <PostOneModel, Model>(
  args: PostOneFactoryArgs<PostOneModel, Model>
) => {
  validate("args", "argument", args, [
    required,
    object2(args, {
      name: truthy(),
      eventValidators: truthy(),
      postOneModelMapper: optional(ofType("function")),
      postOneModelValidators: truthy(),
      modelMapper: ofType("function"),
      createOne: ofType("function"),
    }),
  ]);

  const {
    eventValidators,
    postOneModelMapper,
    postOneModelValidators,
    modelMapper,
    modelValidators,
    createOne,
    name,
  } = args;

  const logger = loggerFactory("postOneFactory");

  logger.debug(`Building postOneHandler '${name}'`);
  const postOne: FunctionHandler = async (event) => {
    validate(
      "event",
      "event",
      event,
      [object({ httpMethod: httpMethod("POST") })].concat(
        Array.isArray(eventValidators)
          ? eventValidators
          : object(eventValidators)
      )
    );

    const logger = loggerFactory(name);

    logger.debug("Parsing 'postOneModelValidator' from event body");

    const postOneModel = (
      postOneModelMapper ||
      ((event) => ({ ...JSON.parse(event.body) } as PostOneModel))
    )(event);

    validate(
      "postOneModel",
      "model",
      postOneModel,
      [truthy()].concat(
        Array.isArray(postOneModelValidators)
          ? postOneModelValidators
          : object(postOneModelValidators)
      )
    );
    logger.debug("Mapping 'model' from 'postOneModel'");
    const model = await getPromise(modelMapper(postOneModel));

    if (modelValidators) {
      validate(
        "model",
        "model",
        model,
        Array.isArray(modelValidators)
          ? modelValidators
          : object2(model, modelValidators)
      );
    }

    const result = await createOne(model);

    return modelCreatedResult(result);
  };

  logger.debug(`postOneHandler '${name}' has been built`);
  return postOne;
};
