import { DesignVariableModel } from "api-shared";
import { APIGatewayProxyEventHeaders } from "aws-lambda";
import { getClientIdFromHeader } from "../core";
import { updateOneDesignVariable } from "../database/updateOneDesignVariable";
import { putOkResponse } from "./core";

/**
 * @summary Takes DesignVariableModel from the CMS and uses it to update the value in the corresponding clientDesignVariable table.
 * @param event
 * @returns Will The designVariableId. Not the clientDesignVariableId. This way it matches the data schema of the CMS.
 */
export const handler = async (event: {
  pathParameters: { id: number };
  headers: APIGatewayProxyEventHeaders;
  body: string;
}) => {
  const designVariableModel = JSON.parse(event.body) as DesignVariableModel;
  const clientId = getClientIdFromHeader(event.headers);
  const id = await updateOneDesignVariable(
    clientId,
    event.pathParameters.id,
    designVariableModel.value
  );
  return putOkResponse({ id });
};
