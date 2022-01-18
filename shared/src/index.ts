
interface StringKeyAnyValuePair {
  key: string;
  value: any
}

export function objectToArray(obj: any) {
  const a: StringKeyAnyValuePair[] = [];
  for (const key in obj) {
    const value = obj[key];
    a.push({ key, value })
  }
  return a;
}

export class UnsupportedValueError extends Error {
  constructor(value: string) {
    super(`Value "${value}" is not supported`);
  }
}
UnsupportedValueError.prototype.name = "UnsupportedValueError";

export type Optional<T> = {
  [Property in keyof T]?: T[Property];
};


