import {
  ComponentTypeMap,
  ComponentWithOneCardModel,
  HasId,
  ObjectRecord,
  PostCreateComponentModel,
  PutOneComponentWithOneCardModel,
} from "api-shared";
import { getOneComponent } from "../src/functions/getOneComponent";
import { postOneComponent } from "../src/functions/postOneComponent";
import { putOneComponent } from "../src/functions/putOneComponent";
import {
  buildLambdaEvent,
  expectJsonToMatchObject,
  parseJson,
} from "../test-tools";

describe("component lifecycle", () => {
  it("creates gets updates and gets", async () => {
    const createResult = await postOneComponent(
      buildLambdaEvent<PostCreateComponentModel>("POST", "/components", null, {
        createOrAdd: "create",
        internalName: "1",
        pageOrProgramId: 1,
        type: "text",
        visible: true,
        card: !ComponentTypeMap.get("text").isList
          ? {
              action: "page",
            }
          : undefined,
      })
    );
    expect(createResult.statusCode).toBe(201);
    const createResultModel = parseJson<HasId>(createResult.body);
    const { id } = createResultModel;
    expect(id).toBeGreaterThan(0);

    const getResult1 = await getOneComponent(
      buildLambdaEvent(
        "GET",
        "/components/{id}",
        (createResultModel as unknown) as ObjectRecord,
        null
      )
    );
    expect(getResult1.statusCode).toBe(200);
    expect(getResult1.body).toBeTruthy();
    const component1 = parseJson<ComponentWithOneCardModel>(getResult1.body);

    const { ad, card, visible, libraryComponent, maxCards, type } = component1;

    expect(component1).toMatchObject<Partial<ComponentWithOneCardModel>>({
      id,
      internalName: "1",
      title: "1",
      type: "text",
      visible: true,
      ad: false,
      libraryComponent: false,
      maxCards: 10,
      status: "ok",
      style: "default",
      viewAllText: "View all",
      cardImagePosition: null,
      cardImageSize: null,
      subTitle: null,
      card: {
        ...card,
        action: "page",
        componentId: id,
        orderIndex: 1,
        visible: true,
      },
    });

    const updateResult = await (async () => {
      return await putOneComponent(
        buildLambdaEvent<PutOneComponentWithOneCardModel>(
          "PUT",
          "/components/{id}",
          (createResultModel as unknown) as ObjectRecord,
          {
            id,
            ad: !ad,
            card: {
              ...card,
              action: "link",
              description: "u",
              imageUrl: null,
              pageDescription: "2",
              title: "2",
              url: null,
              visible: !visible,
            },
            internalName: "2",
            libraryComponent: !libraryComponent,
            maxCards: maxCards + 1,
            style: "spotlight",
            type,
            viewAllText: "2",
            visible: !visible,
            cardImagePosition: "left",
            cardImageSize: "cover",
            subTitle: "2",
            title: "2",
          }
        )
      );
    })();

    expect(updateResult.statusCode).toBe(200);
    expect(updateResult.body).toBeTruthy();
    //  todo: to match deserializedobject
    expect(parseJson(updateResult.body)).toMatchObject<HasId>({ id });

    const getResult2 = await getOneComponent(
      buildLambdaEvent(
        "GET",
        "/components/{id}",
        (createResultModel as unknown) as ObjectRecord,
        null
      )
    );

    expect(getResult2.statusCode).toBe(200);
    expect(getResult2.body).toBeTruthy();
    expectJsonToMatchObject<ComponentWithOneCardModel>(getResult2.body, {
      id,
      ad: !ad,
      card: {
        ...card,
        componentId: id,
        orderIndex: 1,
        action: "link",
        description: "u",
        imageUrl: null,
        title: "2",
        url: null,
        visible: !visible,
      },
      internalName: "2",
      libraryComponent: !libraryComponent,
      maxCards: maxCards + 1,
      style: "spotlight",
      type,
      viewAllText: "2",
      visible: !visible,
      cardImagePosition: "left",
      cardImageSize: "cover",
      subTitle: "2",
      title: "2",
      status: "ok",
    });

    // //  todo: uncomment once delete is fully implemented
    // const deleteResult = await deleteOneComponent(
    //   buildLambdaEvent("DELETE", "/components/{id}", createResultModel, null)
    // );

    // expect(deleteResult.statusCode).toBe(200);
    // expect(deleteResult.body).toBeTruthy();
    // expectJsonToMathObject<HasId>(deleteResult.body, createResultModel);

    // const getResult3 = await getOneComponent(
    //   buildLambdaEvent("GET", "/components/{id}", createResultModel, null)
    // );
    // expect(getResult3.statusCode).toBe(200);
    // expect(getResult3.body).toBeTruthy();
    // expectJsonToMathObject<Partial<ComponentWithOneCardModel>>(
    //   getResult3.body,
    //   { status: "deleted" }
    // );
  });
});
