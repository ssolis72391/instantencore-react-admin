import {
  ComponentTypeCollection,
  ComponentTypeMap,
  CreateOrAdd,
  CreateOrAddCollection,
  PageComponentModel,
  PostAddComponentModel,
  PostCreateComponentModel,
  Remove,
} from "api-shared";
import { ComponentCardHelper } from "api-shared/lib/cards";
import { elementOf, equals, id, ofType, optional, truthy } from "../core";
import { createOnePageComponent } from "../database/createOnePageComponent";
import { getWrappedHandler } from "../functions/core";
import { postOneFactory } from "../functions/factories";

export const postOneComponent = postOneFactory<
  PostAddComponentModel | PostCreateComponentModel,
  Partial<Remove<PageComponentModel, "id">> & {
    createOrAdd: CreateOrAdd;
  }
>({
  name: "postOneComponent",
  eventValidators: { resource: equals("/components") },
  postOneModelValidators: {
    componentId: optional([id()]),
    createOrAdd: elementOf(CreateOrAddCollection.getKeys()),
    internalName: optional([ofType("string")]),
    pageOrProgramId: id(),
    type: optional([elementOf(ComponentTypeCollection.getKeys())]),
    visible: optional([truthy(), ofType("boolean")]),
  },
  modelMapper: (model) => {
    const { createOrAdd, pageOrProgramId: pageId } = model;
    switch (createOrAdd) {
      case "add":
        const { componentId } = model as PostAddComponentModel;
        return {
          componentId,
          pageId,
          createOrAdd,
          datesOverrideMode: "show",
        };
      case "create":
        const {
          internalName,
          type,
          visible,
          card: { action, url },
        } = model as PostCreateComponentModel;
        const cardImagePositions = ComponentCardHelper.getCardImagePositions(
          type
        );
        const cardImageSizes = ComponentCardHelper.getCardImageSizes(type);
        return {
          pageId,
          visible,
          component: {
            type,
            ad: false,
            style: "default",
            maxCards: 10,
            viewAllText: "View all",
            id: 0,
            internalName,
            libraryComponent: false,
            status: "ok",
            visible,
            title: internalName,
            cardImagePosition: cardImagePositions.length
              ? cardImagePositions[0]
              : null,
            cardImageSize: cardImageSizes.length ? cardImageSizes[0] : null,
            cards: ComponentTypeMap.get(type).isList
              ? undefined
              : [
                  {
                    action,
                    url: action === "link" ? url : undefined,
                    page:
                      action === "page"
                        ? {
                            headerImageSize: "cover",
                            headerTextPosition: "overlay",
                            id: 0,
                            internalName: "",
                            status: "ok",
                          }
                        : undefined,
                    orderIndex: 1,
                    visible,
                    componentId: 0,
                    id: 0,
                  },
                ],
          },
          datesOverrideMode: "show",
          createOrAdd,
        };
      default:
        break;
    }
  },

  // todo: complete
  createOne: async (model) => {
    const {
      createOrAdd,
      component,
      componentId,
      pageId,
      datesOverrideMode,
    } = model;
    const {
      type,
      ad,
      style,
      maxCards,
      viewAllText,
      id,
      internalName,
      libraryComponent,
      status,
      visible,
      title,
      cardImagePosition,
      cardImageSize,
      cards,
    } = component;
    return await createOnePageComponent({
      componentId:
        createOrAdd === "add"
          ? componentId
          : createOrAdd === "create"
          ? undefined
          : undefined,
      datesOverrideMode,
      pageId,
      component:
        createOrAdd === "create"
          ? {
              type,
              ad,
              style,
              maxCards,
              viewAllText,
              id,
              internalName,
              libraryComponent,
              status,
              visible,
              title,
              cardImagePosition,
              cardImageSize,
              cards,
            }
          : createOrAdd === "add"
          ? undefined
          : undefined,
    });
  },
});

export const handler = getWrappedHandler(postOneComponent);
