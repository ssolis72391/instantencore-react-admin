import { APIGatewayProxyEventHeaders } from "aws-lambda";

/**
 * Gets the clientId (stored as cid) from the Authorization Bearer token. Expects Authorization header to be in the format of: Bearer {"cid":1,"name":"The name"}
 * @param headers
 * @TODO replace with standard JWT token decoding implementation
 */
export function getClientIdFromHeader(headers: APIGatewayProxyEventHeaders) {
  const authorizationHeader = headers["Authorization"];
  const authorizationTokenString = authorizationHeader
    .replace("Bearer", "")
    .trim();
  // warning: here we're making the assumption the token is JSON which is not the standard
  const authorizationToken = JSON.parse(authorizationTokenString) as {
    cid: string;
  };
  const clientId = authorizationToken.cid;
  return +clientId;
}
