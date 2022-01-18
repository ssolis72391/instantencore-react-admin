import { rfc3339_dateonly_format } from "api-shared";
import * as dayjs from "dayjs";
import * as utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export function getCurrentRfc3339FullDate() {
  return dayjs().format(rfc3339_dateonly_format);
}

export function getCurrentRfc3339FullUtcDate() {
  return dayjs().utc().format(rfc3339_dateonly_format);
}
