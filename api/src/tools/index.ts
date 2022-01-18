import * as dayjs from "dayjs";
import { CONSTANTS, ValidatorJsError } from "../core";
import { jsonResult } from "./jsonResult";
// import { programMapper } from "./programMapper";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

/**
 * @deprecated use validate<T>(string,ValidationType,T,Validator<T>|Validator<T>[])
 */
function validatetRfc3339DateOnlyString(value: string) {
  const date = dayjs(value, CONSTANTS.rfc3339DateOnlyFormat, true);
  const isValid = date.isValid();
  const parts = value.split("-");
  if (
    !isValid ||
    +parts[0] !== date.get("year") ||
    +parts[1] !== date.get("month") + 1 ||
    +parts[2] !== date.get("date")
  ) {
    throw new ValidatorJsError("Invalid Rfc3339 date-time string");
  }
}

function getDateOnlyFromRfc3339String(value: string): Date {
  console.debug({ function: getDateOnlyFromRfc3339String.name, value });
  const date = dayjs(value, "YYYY-MM-DD", true);
  const isValid = date.isValid();
  const parts = value.split("-");
  if (
    !isValid ||
    +parts[0] !== date.get("year") ||
    +parts[1] !== date.get("month") + 1 ||
    +parts[2] !== date.get("date")
  ) {
    throw new ValidatorJsError("Invalid Rfc3339 date string");
  }
  return date.toDate();
}

function toUtc(value: Date) {
  if (!(value instanceof Date)) {
    throw Error("Invalid type");
  }
  return dayjs(value).add(value.getTimezoneOffset(), "minutes").toDate();
}

function getDateOnly(value: string | Date): Date {
  function getDateOnlyFromDate(value: Date) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }

  if (value instanceof Date) {
    return getDateOnlyFromDate(value);
  } else if (typeof value === "string") {
    value = new Date(value);
    return getDateOnlyFromDate(value);
  } else {
    throw Error('Cannot cast DateOnly from value "' + value + '"');
  }
}

export {
  jsonResult,
  // programMapper,
  getDateOnly,
  toUtc,
  getDateOnlyFromRfc3339String,
  validatetRfc3339DateOnlyString,
};
