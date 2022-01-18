import { TimeZoneProvider } from "../src";

describe("TimeZoneProvider", () => {
  describe("getAll", () => {
    it("works", () => {
      const result = TimeZoneProvider.getAll();
      expect(result).toBeTruthy();
      result.forEach((item) => {
        expect(item).toBeTruthy();
        const { currentOffset, name, offset, rawString } = item;
        expect(currentOffset).toBeGreaterThanOrEqual(-11);
        expect(currentOffset).toBeLessThanOrEqual(14);
        expect(name?.trim()).toBeTruthy();
        expect(offset).toBeGreaterThanOrEqual(-12);
        expect(offset).toBeLessThanOrEqual(14);
        expect(rawString?.trim()).toBeTruthy();
      });
    });
    it("sorting works", () => {
      const { length } = TimeZoneProvider.getAll();
      const result = TimeZoneProvider.getAll({ orderBy: "name" }).map(
        (e) => e.name
      );
      let lastName: string;
      result.forEach((name) => {
        if (lastName) {
          expect(lastName <= name).toBeTruthy();
          lastName = name;
        } else {
          lastName = name;
        }
      });
      expect(length).toBe(result.length);
    });
  });
});
