import LError from "./lerror";

export default class BadRequestError extends LError {
  constructor(message) {
    super(message || "Bad Request", { statusCode: 400 });
  }
}
