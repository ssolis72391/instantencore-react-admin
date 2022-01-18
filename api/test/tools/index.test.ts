import { toUtc, getDateOnlyFromRfc3339String } from "../../src/tools";
describe("tools", () => {
  describe("getDateOnlyFromRfc3339String", () => {
    it.each([
      ["2021-12-31", 2021, 11, 31],
      ["2021-12-31", 2021, 11, 31],
      ["2021-12-31", 2021, 11, 31],
    ])('should work with valid value: "%s"', (value, year, month, day) => {
      const date = getDateOnlyFromRfc3339String(value);

      expect(date.getFullYear()).toEqual(year);
      expect(date.getMonth()).toEqual(month);
      expect(date.getDate()).toEqual(day);
      expect(date.getHours()).toEqual(0);
      expect(date.getMinutes()).toEqual(0);
      expect(date.getSeconds()).toEqual(0);
    });

    it.each(["2021/01/01", "01/01/2021", "20210101"])(
      'should throw due wrong format: "%s"',
      (value) => {
        expect(() => getDateOnlyFromRfc3339String(value)).toThrow();
      }
    );

    it.each(["1970-00-00", "1970-00-01", "2021-13-01"])(
      'should throw due invalid value: "%s"',
      (value) => {
        expect(() => getDateOnlyFromRfc3339String(value)).toThrow();
      }
    );
  });
});
