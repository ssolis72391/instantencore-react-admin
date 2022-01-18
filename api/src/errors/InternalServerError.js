import LError from "./lerror";

export default class InternalServerError extends LError {
  constructor(message) {
    super(message || "Internal Server Error", { statusCode: 500 });
  }
}
