import LError from "./lerror";

export default class UnauthorizedError extends LError {
  constructor(message) {
    super(message || "Unauthorized", { statusCode: 401 });
  }
}
