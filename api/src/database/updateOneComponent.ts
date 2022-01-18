import { ComponentModel, Remove } from "api-shared";
import { loggerFactory } from "../core";
import { cardMapper } from "./cardMapper";
import { updateOneByIdFactory } from "./factories";
import { Card, Component } from "./models";
import { RemoveSequelizeModelProps } from "./sequelize";
export const updateOneComponent = updateOneByIdFactory<
  Partial<Remove<ComponentModel, "deletedAt">>,
  Partial<RemoveSequelizeModelProps<Component>>
>({
  name: "updateOneComponent",
  innerUpdateOneByIdModelMapper: ({
    id,
    model: {
      ad,
      cardImagePosition,
      cardImageSize,
      cards,
      dates,
      internalName,
      libraryComponent,
      maxCards,
      status,
      style,
      subTitle,
      title,
      type,
      viewAllText,
      visible,
    },
  }) => {
    return {
      id,
      model: {
        id,
        ad,
        cardImagePosition,
        cardImageSize,
        cards: cards?.map(cardMapper.mapInnerModel),
        dates,
        internalName,
        libraryComponent,
        maxCards,
        status,
        deletedAt: status === "deleted" ? new Date() : null,
        style,
        subTitle,
        title,
        type,
        viewAllText,
        visible,
      },
    };
  },
  innerUpdateOneById: async ({ id, model, logger: _logger }) => {
    const logger = _logger || loggerFactory("innerUpdateOneById");
    const { cards } = model;
    if (cards) {
      return await Component.sequelize.transaction(async (transaction) => {
        const results: number[] = [];
        await Promise.all(
          [
            Component.update(model, {
              where: { id },
              transaction,
              logging: (sql, ms) => logger.trace(JSON.stringify({ sql, ms })),
              benchmark: true,
            }).then((item) => results.push(item[0])),
          ].concat(
            cards.map((item) => {
              const {
                id,
                action,
                description,
                imageUrl,
                title,
                url,
                visible,
              } = item;
              return Card.update(
                {
                  action,
                  description,
                  imageUrl,
                  title,
                  url,
                  visible,
                },
                {
                  where: { id },
                  transaction,
                  logging: (sql, ms) =>
                    logger.trace(JSON.stringify({ sql, ms })),
                  benchmark: true,
                }
              ).then((item) => results.push(item[0]));
            })
          )
        );
        return results.reduce((a, b) => a + b);
      });
    } else {
      return (
        await Component.update(model, {
          where: { id },
          logging: (sql, ms) => logger.trace(JSON.stringify({ sql, ms })),
          benchmark: true,
        })
      )[0];
    }
  },
});
