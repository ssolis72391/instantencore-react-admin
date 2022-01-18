//  todo: replace with okResult
import { APIGatewayProxyResult } from "aws-lambda";
/**
Obsolete
*/
const jsonResult = <T>(t: T): APIGatewayProxyResult => {
  return {
    statusCode: 200,
    body: JSON.stringify(t),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,GET",
    },
  };
};

export { jsonResult };
