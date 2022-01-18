/**
 * @summary future usage
 */
type ModelWithKeys<Model, Key = keyof Model> = {
  keys: [Key, unknown] | [Key, unknown][];
};

/**
 * @summary future usage
 */
function getKeysArray<Model, Key = keyof Model>(model: ModelWithKeys<Model>) {
  const { keys } = model;
  const first = keys[0];
  if (Array.isArray(first)) {
    return keys as [Key, unknown][];
  }
  return [keys as [Key, unknown]];
}
