import { ComponentModel, PageComponentModel } from "./components";
import {
  HasId,
  ImageSizeKey,
  NamedCollection,
  Remove,
  TextPositionKey,
} from "./core";

export type PageStatusKey = "ok" | "deleted";
export const PageStatusCollection = new NamedCollection<PageStatusKey, string>({
  deleted: "Deleted",
  ok: "Ok",
});

export type FlatPageComponentModel = ComponentModel &
  Remove<PageComponentModel, "id" | "component" | "componentId">;

/**
 * Page model
 */
export interface PageModel extends HasId {
  /**
   * Name
   */
  internalName: string;
  /**
   * Header pre title
   */
  headerPreTitle?: string;
  /**
   * Header title
   */
  headerTitle?: string;
  /**
   * Header sub title
   */
  headerSubTitle?: string;
  /**
   * Header image URL
   */
  headerImageUrl?: string | null;
  /**
   * Header image size
   */
  headerImageSize: ImageSizeKey;
  /**
   * Header text position
   */
  headerTextPosition: TextPositionKey;
  /**
   * Components
   */
  components?: FlatPageComponentModel[];
  /**
   * Page status
   */
  readonly status: PageStatusKey;
}

/**
 * @deprecated pages are not created by the cms
 */
export type PostOnePageModel = Remove<PageModel, "id" | "components">;

export type PutOnePageModel = Remove<PageModel, "components" | "status">;
