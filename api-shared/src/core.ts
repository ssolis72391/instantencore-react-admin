/**
 * @summary makes all members partial but the ones passed in K wich are made required
 */
export type PartialWithRequired<T, K extends keyof T> = Partial<T> &
  Required<Pick<T, K>>;

export type SomeOptional<T, K extends keyof T> = Remove<T, K> &
  { [P in K]?: P };

/**
 * @summary Removes `K` from `T`
 */
export type Remove<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * @todo rename to HasOrder
 */
export interface HasOrderIndex {
  /**
   * @todo rename to order
   */
  orderIndex: number;
}

/**
 * @summary exposes an id prop of type number
 */
export interface HasId {
  id: number;
}

export type KeyValuePair<K, T> = {
  key: K;
  value: T;
};

export type StringsKeyValuePair = KeyValuePair<string, string>;
/**
 * @summary Omits id property
 */
export type OmitId<Model extends HasId> = Remove<Model, "id">;

class ArgumentUndefinedError extends Error {
  constructor(argumentName: string) {
    super(`Argument '${argumentName}' cannot be undefined`);
  }
  static validate(value: any, argumentName: string) {
    if (value === undefined) {
      throw new ArgumentUndefinedError(argumentName);
    }
  }
}

/**
 * @todo rename to something NamedDictionary
 */
export class NamedCollection<Key extends string, Value> {
  /**
   * @todo make record private and move to the following pattern:
   * 1. declare key type. eg: type KeyType = "a"|"b"|"c" etc
   * 1. create record using key type. eg: const record : Record<KeyType,ValueType>
   * 1. create NamedCollection from record. eg. const recordCollection = new NamedCollection(record);
   */
  constructor(public readonly record: Record<Key, Value>) {
    ArgumentUndefinedError.validate(record, "record");
  }
  getKeys() {
    return Object.entries(this.record).map((item) => item[0] as Key);
  }
  getKey(value: Value): Key {
    ArgumentUndefinedError.validate(value, "value");
    for (const key in this.record) {
      if (this.record[key] === value) {
        return key;
      }
    }
    throw Error("Key not found");
  }
  getValue(key: Key): Value {
    ArgumentUndefinedError.validate(key, "key");
    const value = this.record[key];
    if (!value) {
      throw Error("Invalid key");
    }
    return value;
  }
  filter(keys: Key[]) {
    const value = {} as Record<Key, Value>;
    keys.forEach((key) => (value[key] = this.record[key]));
    return new NamedCollection(value);
  }
  getKeyValuePairsArray(keys?: Key[]): KeyValuePair<Key, Value>[] {
    return !keys
      ? Object.entries(this.record).map((item) => ({
          key: item[0] as Key,
          value: item[1] as Value,
        }))
      : Object.entries(this.record)
          .filter((item) => keys?.includes(item[0] as Key))
          .map((item) => ({ key: item[0] as Key, value: item[1] as Value }));
  }
}

/**
 * @deprecated moving delete status to custom status per model
 */
export interface HasDeletedAt {
  deletedAt?: Date;
}

/**
 * @todo replace with Contains or HasImageUrl
 */
export interface ImagePayload {
  imageUrl?: string;
  /**
   * @deprecated api should be able to identity if is standard or data url
   */
  isImageDataUrl?: boolean;
}

export type ImageSizeKey = "cover" | "contain" | "full";
export const ImageSizeCollection = new NamedCollection<ImageSizeKey, string>({
  contain: "Contain",
  cover: "Cover",
  full: "Full",
} as const);

export type TextPositionKey = "above" | "overlay" | "below";
const TextPosition: Record<TextPositionKey, string> = {
  above: "Above image",
  below: "Below image",
  overlay: "Overlay image",
};
export const TextPositionCollection = new NamedCollection(TextPosition);

export type ValuesEqualsKeys<T> = { [P in keyof T]-?: P };

/**
 * @TODO Review if this has any value or remove
 */
export type PostManyModel<Model> = {
  models: Model[];
};

/**
 * Indexed object
 */
export type ObjectRecord = Record<string, unknown>;
