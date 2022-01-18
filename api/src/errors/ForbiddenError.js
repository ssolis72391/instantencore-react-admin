import LError from "./lerror";

export default class ForbiddenError extends LError {
  constructor(message) {
    super(message || "Forbidden", { statusCode: 403 });
  }
}
