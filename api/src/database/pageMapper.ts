import { PageModel } from "api-shared";
import { ModelMapper } from "./core";
import { Page } from "./models";

/**
 * Maps a {@link PageModel} to a {@link Page} and vice versa
 */
export const pageMapper: ModelMapper<PageModel, Page> = {
  mapModel({
    headerImageSize,
    headerTextPosition,
    id,
    internalName,
    status,
    deletedAt,
    headerImageUrl,
    headerPreTitle,
    headerSubTitle,
    headerTitle,
    pageComponents,
  }) {
    return {
      headerImageSize,
      headerTextPosition,
      id,
      internalName,
      status,
      deletedAt,
      headerImageUrl,
      headerPreTitle,
      headerSubTitle,
      headerTitle,
      pageComponents,
    };
  },
  mapInnerModel({
    headerImageSize,
    headerTextPosition,
    id,
    internalName,
    status,
    headerImageUrl,
    headerPreTitle,
    headerSubTitle,
    headerTitle,
  }) {
    return {
      headerImageSize,
      headerTextPosition,
      id,
      internalName,
      status,
      headerImageUrl,
      headerPreTitle,
      headerSubTitle,
      headerTitle,
    };
  },
};
