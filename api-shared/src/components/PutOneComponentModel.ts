import { CardModel } from "..";
import { Remove } from "../core";
import { ComponentWithOneCardModel } from "./ComponentModel";

type Replace<T, K extends keyof T, R> = Remove<T, K> & { K: R };

export type PutOneComponentWithOneCardModel = Remove<
  ComponentWithOneCardModel,
  "status" | "deletedAt" | "card"
> & {
  card: Remove<CardModel, "orderIndex" | "page" | "pageId" | "componentId">;
};

export type PutOneComponentWithoutCardModel = Remove<
  ComponentWithOneCardModel,
  "status" | "deletedAt" | "card"
>;
