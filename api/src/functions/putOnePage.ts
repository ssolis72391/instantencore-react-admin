import { PageModel, PutOnePageModel, Remove } from "api-shared";
import { equals, id } from "../core";
import { updateOnePage } from "../database/updateOnePage";
import { getWrappedHandler } from "./core";
import { putOneFactory } from "./factories";

export const putOnePage = putOneFactory<
  PutOnePageModel,
  Remove<PageModel, "id" | "components" | "status">
>({
  name: "putOnePage",
  eventValidators: { resource: equals("/pages/{id}") },
  putOneModelValidators: { id: id() },
  updateOneModelMapper: ({
    headerImageSize,
    headerTextPosition,
    id,
    internalName,
    headerImageUrl,
    headerPreTitle,
    headerSubTitle,
    headerTitle,
  }) => ({
    id,
    model: {
      headerImageSize,
      headerTextPosition,
      internalName,
      headerImageUrl,
      headerPreTitle,
      headerSubTitle,
      headerTitle,
    },
  }),
  updateOne: updateOnePage,
});

export const handler = getWrappedHandler(putOnePage);
