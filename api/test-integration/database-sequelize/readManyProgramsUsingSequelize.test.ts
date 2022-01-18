import { readManyProgramsUsingSequelize } from "../../src/database/readManyProgramsUsingSequelize";

describe("readManyProgramsUsingSequelize", () => {
  it("works", async () => {
    const pageSize = 10;
    const pageIndex = 0;
    const { models, totalCount } = await readManyProgramsUsingSequelize({
      filter: {
        deleted: true,
        text: "a",
      },
      pagination: { pageIndex, pageSize },
      sort: ["id", "asc"],
    });

    console.log({ totalCount });
    expect(models).toBeTruthy();
    expect(totalCount).toEqual(expect.any(Number));
  });

  // eslint-disable-next-line jest/no-focused-tests
  it.only("sorts by page.internalName", async () => {
    const pageSize = 10;
    const pageIndex = 0;
    const { models, totalCount } = await readManyProgramsUsingSequelize({
      filter: {
        deleted: true,
      },
      pagination: { pageIndex, pageSize },
      sort: ["internalName", "asc"],
    });

    expect(models).toBeTruthy();
    expect(models.map((item) => item.page.internalName)).toMatchObject(
      models
        .map((item) => item.page.internalName)
        .sort((a, b) => {
          const _a = a.toLowerCase();
          const _b = b.toLowerCase();
          return _a < _b ? -1 : _a > _b ? 1 : 0;
        })
    );
    expect(totalCount).toBeGreaterThanOrEqual(models.length);
  });
});
