import { PageModel } from "api-shared";
import { updateOneByIdFactory } from "./factories";
import { Page } from "./models";

export const updateOnePage = updateOneByIdFactory<
  Partial<PageModel>,
  Partial<Page>
>({
  name: "updateOnePage",
  innerUpdateOneByIdModelMapper: ({ id, model }) => {
    const {
      headerImageSize,
      headerTextPosition,
      internalName,
      status,
      headerImageUrl,
      headerPreTitle,
      headerSubTitle,
      headerTitle,
    } = model;

    return {
      id,
      model: {
        headerImageSize,
        headerTextPosition,
        internalName,
        headerImageUrl,
        headerPreTitle,
        headerSubTitle,
        headerTitle,
        deletedAt:
          status !== undefined
            ? status === "deleted"
              ? new Date()
              : null
            : undefined,
        status,
      },
    };
  },
  innerUpdateOneById: async ({ id, model }) => {
    const result = await Page.update(model, { where: { id } });
    return result[0];
  },
});
