import {
  PostOneProgramModel,
  ProgramModel,
  Remove,
  TimeZoneProvider,
} from "api-shared";
import {
  elementOf,
  equals,
  getClientIdFromHeader,
  id,
  imageUrl,
  ofType,
  optional,
  rfc3339fullDate,
} from "../core";
import {
  getValidationResults,
  gte,
  nonEmpty,
  object,
} from "../core/validation";
import { createOneProgram } from "../database/createOneProgram";
import { getWrappedHandler, storeAndOrGetImageUrl, toUtc } from "./core";
import { postOneFactory } from "./factories";

/*
 *  @api [post] /programs
 *  requestBody:
 *    required: true
 *    content:
 *      application/json:
 *        schema:
 *          $ref: "#/components/schemas/PostOneProgramModel"
 *  responses:
 *    201:
 *      $ref: "#/components/responses/ResourceCreatedResponse"
 *  x-amazon-apigateway-integration:
 *    uri: "arn:aws:apigateway:${aws_region}:lambda:path/2015-03-31/functions/${get-programs-function-arn}:${lambda_alias}/invocations"
 *    credentials: "${lambda_execution_role_arn}"
 *    responses:
 *      default:
 *        statusCode: "200"
 *    passthroughBehavior: when_no_match
 *    httpMethod: POST
 *    contentHandling: CONVERT_TO_TEXT
 *    type: aws_proxy
 */
/**
 * @todo request model should not include clientId so we need 2 models here
 */
export const postOneProgram = postOneFactory<
  PostOneProgramModel,
  Remove<ProgramModel, "id" | "imageUrl">
>({
  name: "postOneProgram",
  eventValidators: { resource: equals("/programs") },
  postOneModelValidators: [
    object<any>({
      headerTitle: [nonEmpty(), ofType("string")],
      headerImageUrl: optional([nonEmpty(), imageUrl]),
      localEndDate: [nonEmpty(), ofType("string", false), rfc3339fullDate],
      localStartDate: [nonEmpty(), ofType("string", false), rfc3339fullDate],
      timeZone: [nonEmpty(), elementOf(TimeZoneProvider.getAllNames())],
      season: optional([ofType("string")]),
    }),
    ({ localEndDate, localStartDate }: PostOneProgramModel) =>
      getValidationResults(localEndDate, gte(localStartDate)),
  ],
  postOneModelMapper: (event) => {
    console.debug(event);
    const postOneProgramModel = {
      ...JSON.parse(event.body),
      clientId: getClientIdFromHeader(event.headers),
    } as PostOneProgramModel;
    return postOneProgramModel;
  },
  modelMapper: async (model) => {
    const {
      localEndDate,
      localStartDate,
      timeZone,
      headerImageUrl,
      headerTitle,
      season,
      clientId,
    } = model;

    const { currentOffset } = TimeZoneProvider.getOne(timeZone);

    return {
      localEndDate,
      localStartDate,
      timeZone,
      headerImageUrl: headerImageUrl
        ? await storeAndOrGetImageUrl(headerImageUrl)
        : null,
      headerTitle,
      season,
      headerImageSize: "cover",
      headerTextPosition: "overlay",
      internalName: headerTitle,
      status: "draft",
      utcEndDate: toUtc(localEndDate, currentOffset),
      utcStartDate: toUtc(localStartDate, currentOffset),
      clientId,
    };
  },
  modelValidators: {
    clientId: id(),
  },
  createOne: createOneProgram,
});

export const handler = getWrappedHandler(postOneProgram);
