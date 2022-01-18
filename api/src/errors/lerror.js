// https://www.joyent.com/node-js/production/design/errors
// http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-mode-exceptions.html
// https://aws.amazon.com/blogs/compute/error-handling-patterns-in-amazon-api-gateway-and-aws-lambda/
// https://gist.github.com/justmoon/15511f92e5216fa2624b
// https://nodejs.org/api/errors.html
// type, message, code, more_info
// var myErrorObj = {
//        errorType : "InternalServerError",
//        httpStatus : 500,
//        requestId : context.awsRequestId,
//        message : "An unknown error has occurred. Please try again."
//    }
// 1. Be clear about what your function does.
// 2. Use Error objects (or subclasses) for all errors, and implement the Error contract.
// 3. Use the Error's name property to distinguish errors programmatically.
// 4. Augment the Error object with properties that explain details
// 5. If you pass a lower-level error to your caller, consider wrapping it instead.

// Property name   Intended use
// localHostname   the local DNS hostname (e.g., that you're accepting connections at)
// localIp	   the local IP address (e.g., that you're accepting connections at)
// localPort	   the local TCP port (e.g., that you're accepting connections at)
// remoteHostname  the DNS hostname of some other service (e.g., that you tried to connect to)
// remoteIp	   the IP address of some other service (e.g., that you tried to connect to)
// remotePort	   the port of some other service (e.g., that you tried to connect to)
// path	           the name of a file, directory, or Unix Domain Socket (e.g., that you tried to open)
// srcpath	   the name of a path used as a source (e.g., for a rename or copy)
// dstpath	   the name of a path used as a destination (e.g., for a rename or copy)
// hostname	   a DNS hostname (e.g., that you tried to resolve)
// ip              an IP address (e.g., that you tried to reverse-resolve)
// propertyName    an object property name, or an argument name (e.g., for a validation error)
// propertyValue   an object property value (e.g., for a validation error)
// syscall         the name of a system call that failed
// errno           the symbolic value of errno (e.g., "ENOENT").
//                 Do not use this for errors that don't actually set the C value of errno.
//                 Use "name" to distinguish between types of errors.

import { WError } from "verror";

export default class LError extends WError {
  constructor(err, options = {}, context) {
    super(err);
    // Saving class name in the property of our custom error as a shortcut.
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);

    if (options.hasOwnProperty("statusCode")) {
      this.statusCode = options.statusCode;
    } else {
      this.statusCode = 500;
    }
    if (typeof context === "object") {
      this.requestId = context.requestId;
      this.remainingTime = context.getRemainingTimeInMills();
    }
    if (typeof context === "string") {
      this.message = context;
    } else {
      if (err instanceof Error) {
        if (err.name === "DynogelsUpdateError") {
          this.message = JSON.stringify(err.detail);
        } else {
          this.message = err.message;
        }
      } else {
        this.message = err;
      }
    }
    if (options) this.info = options;
  }

  toJSON() {
    const json = {};
    json.name =
      (this.hasOwnProperty("name") && this.name) ||
      this.constructor.name ||
      this.constructor.prototype.name;
    if (this.message) json.message = this.message;
    if (this.statusCode) json.statusCode = this.statusCode;
    if (this.requestId) json.requestId = this.requestId;
    if (this.cause && this.cause.message) json.cause = this.cause.toString();

    return JSON.stringify(json);
  }

  toString() {
    return this.toJSON();
  }
}
