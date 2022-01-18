import { PageComponentModel, Remove } from "api-shared";
import { Transaction } from "sequelize";
import { loggerFactory } from "../core";
import { forEachAsync } from "../core/core";
import { componentMapper } from "./componentMapper";
import { createOneFactory } from "./factories";
import { Card, Component, Page, PageComponent } from "./models";
import { RemoveSequelizeModelProps } from "./sequelize";

async function innerCreateOnePageComponent({
  pageComponent,
  transaction,
}: {
  pageComponent: RemoveSequelizeModelProps<PageComponent, "id" | "orderIndex">;
  transaction?: Transaction;
}) {
  const { componentId, datesOverrideMode, pageId } = pageComponent;

  await PageComponent.create(
    {
      pageId,
      componentId,
      datesOverrideMode,
      orderIndex:
        (await PageComponent.count({ where: { pageId }, transaction })) + 1,
    },
    { transaction }
  );
}

export const createOnePageComponent = createOneFactory<
  Remove<PageComponentModel, "id" | "orderIndex">
>({
  name: "createOnePageComponent",
  modelValidation: [
    ({ componentId, component }) =>
      componentId && component
        ? "Both 'component' and 'componentId' fields cannot be present"
        : undefined,
    ({ componentId, component }) =>
      !componentId && !component
        ? "One of 'component' or 'componentId' fields must be present"
        : undefined,
    ,
  ],
  innerCreateOne: async (model) => {
    const { componentId, pageId, component, datesOverrideMode } = model;

    const logger = loggerFactory("innerCreateOne");

    if (component) {
      return await Component.sequelize.transaction(async (transaction) => {
        const componentModel = componentMapper.mapInnerModel(component);
        const { cards } = componentModel;
        // create the component
        const { id: componentId } = await Component.create(componentModel, {
          transaction,
        });

        // create the pageComponent
        await innerCreateOnePageComponent({
          pageComponent: {
            pageId,
            datesOverrideMode,
            componentId,
          },
          transaction,
        });
        // create cards if available
        if (cards) {
          logger.debug("One or more cards found for insert");
          await forEachAsync(
            cards,
            async (item) => {
              const { page } = item;
              // create page if available and card
              if (page) {
                logger.debug("Inserting page");
                const { id: pageId } = await Page.create(page, { transaction });
                logger.debug("Inserting card");
                await Card.create(
                  { ...item, pageId, componentId },
                  { transaction }
                );
              } else {
                // create card only
                logger.debug("Inserting one card only");
                await Card.create(
                  { ...item, pageId, componentId },
                  { transaction }
                );
              }
            },
            true
          );
        }
        return componentId;
      });
    } else {
      await innerCreateOnePageComponent({
        pageComponent: { componentId, datesOverrideMode, pageId },
      });
      return componentId;
    }
  },
  resultMapper: (result) => result,
});
