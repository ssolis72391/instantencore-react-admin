import { APIGatewayProxyEventHeaders } from "aws-lambda";
import { getClientIdFromHeader } from "../core";
import { readManyDesignVariables } from "../database/readManyDesignVariables";
import { okResult } from "./core";

export const handler = async (event: {
  headers: APIGatewayProxyEventHeaders;
}) => {
  const clientId = getClientIdFromHeader(event.headers);
  const designVariables = await readManyDesignVariables(clientId);
  return okResult({
    models: designVariables,
    totalCount: designVariables.length,
  });
};
