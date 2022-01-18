// todo: uncomment and update implementation

// import { APIGatewayProxyResult } from "aws-lambda";
// import { getWrappedHandler, LambdaHandler } from "../core";
// import { destroyOneComponent } from "../database/destroyOneComponent";
// import { deletedResponse } from "./core";

// const deleteOneComponent: LambdaHandler = async (
//   event
// ): Promise<APIGatewayProxyResult> => {
//   const id = +event.pathParameters.id;
//   await destroyOneComponent(id);
//   return deletedResponse({ id });
// };

// const handler = getWrappedHandler(deleteOneComponent);

// export { handler, deleteOneComponent };
