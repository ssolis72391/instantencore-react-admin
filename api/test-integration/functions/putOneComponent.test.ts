import { PutOneComponentWithOneCardModel } from "api-shared";
import { handler } from "../../src/functions/putOneComponent";

describe("putOneComponent", () => {
  it("works", async () => {
    const model: PutOneComponentWithOneCardModel = {
      id: 5,
      type: "text",
      libraryComponent: false,
      card: {
        action: "none",
        id: 3,
        description: null,
        imageUrl: null,
        title: null,
        url: null,
        visible: true,
      },
      ad: false,
      style: "default",
      internalName: "text 1 ",
      title: "text 1 ",
      subTitle: "s",
      cardImagePosition: null,
      cardImageSize: null,
      visible: false,
      maxCards: 10,
      viewAllText: "View all",
    };

    const { statusCode, body } = await handler({
      httpMethod: "PUT",
      resource: "/components/{id}",
      body: JSON.stringify(model),
      pathParameters: {
        id: "5",
      },
    });

    expect(statusCode).toBe(200);
    expect(body).toBeTruthy();
    expect(JSON.parse(body)).toEqual({ id: 5 });
  });
});
