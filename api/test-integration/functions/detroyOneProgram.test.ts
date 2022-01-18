import * as dotenv from "dotenv";
import { detroyOneProgram } from "../../src/database/detroyOneProgram";
dotenv.config();

describe("detroyOneProgram", () => {
  it("works", async () => {
    const result = await detroyOneProgram({ id: 5 });
    expect(result).toBeGreaterThanOrEqual(0);
  });
});
