import { truthy } from "../../../src/core/validation";

describe("truthy validator", () => {
  it("returns undefined on truthy", () => {
    expect(truthy()(1)).toBeUndefined();
  });
  it("returns an error message on falsy", () => {
    const error = truthy()(0);
    expect(typeof error).toBe("string");
  });
});
