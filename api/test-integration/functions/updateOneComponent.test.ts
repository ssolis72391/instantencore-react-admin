import { updateOneComponent } from "../../src/database/updateOneComponent";

describe("updateOneComponent", () => {
  it("works", async () => {
    const result = await updateOneComponent({
      id: 1,
      model: {
        id: 5,
        type: "text",
        libraryComponent: false,
        cards: [
          {
            action: "none",
            componentId: 5,
            id: 3,
            orderIndex: 1,
            description: null,
            imageUrl: null,
            title: null,
            url: null,
            visible: true,
            pageId: null,
          },
        ],
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
      },
    });
    expect(result).toBeGreaterThanOrEqual(0);
  });
});
