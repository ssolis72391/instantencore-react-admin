import { ComponentWithOneCardModel } from "api-shared";
import { getOneComponent } from "../../src/functions/getOneComponent";

/**
 * @todo fix test
 */
describe("getOneComponent", () => {
  it.skip("works", async () => {
    const { statusCode, body } = await getOneComponent({
      httpMethod: "GET",
      resource: "/components/{id}",
      pathParameters: { id: "1" },
    });
    const { card } = JSON.parse(body) as ComponentWithOneCardModel;

    expect(statusCode).toBe(200);
    expect(card).toBeTruthy();
  });
});
