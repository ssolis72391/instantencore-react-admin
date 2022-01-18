import { StringsKeyValuePair } from "./core";

/**
 * @deprecated use NamedCollection<Key,Value> class
 */
export type TypeMap<K extends string> = {
  /**
   * @todo rename to valueDictionary
   */
  values: Record<K, string>;
  /**
   * @todo rename to keyDictionary
   */
  keys: Record<string, K>;
  /**
   * @todo rename to stringKeyValuePairArray
   */
  array: StringsKeyValuePair[];
  /**
   * @todo rename as keyStringArray
   */
  keysArray: string[];
};

/**
 * @deprecated use NamedCollection<Key,Value> class
 */
export function buildTypeMap<K extends string>(
  values: Record<K, string>
): TypeMap<K> {
  const keys: Record<K, string> | any = {};
  const keysArray: string[] = [];

  const array: StringsKeyValuePair[] = [];

  for (const key in values) {
    const value = values[key];
    keys[value] = key;
    values[key as K] = value;
    array.push({ key, value });
    keysArray.push(key);
  }

  return {
    values,
    keys,
    array,
    keysArray,
  };
}
