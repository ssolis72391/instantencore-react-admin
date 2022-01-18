import { Card } from "./models";

export const readLatestCardOrderIndex = async (componentId: number) => {
  const numCards = await Card.count({
    where: {
      componentId: componentId,
    },
  });
  return numCards + 1;
};
