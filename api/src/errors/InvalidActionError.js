import LError from "./lerror";

export default class InvalidActionError extends LError {
  constructor(message) {
    super(message || "Invalid Action", { statusCode: 400 });
  }
}
