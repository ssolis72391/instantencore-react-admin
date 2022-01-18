import { handler } from "../../src/lambdas/get-user";

describe("get-user", () => {
  it("handler", async () => {
    const result = await handler({
      httpMethod: "GET",
      resource: "/users/{id}",
      pathParameters: {
        id: "1",
      },
    });

    expect(result).toBeTruthy();
  });
});
