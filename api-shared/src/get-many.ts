import { HasId, ObjectRecord } from "./core";

export type ComparisonOp = "eq" | "ne" | "gt" | "lt";

export type LogicalOp = "and" | "or";

export type SortDirection = "desc" | "asc";

export type TypedField<Model> = keyof Model;

export type Value = string | number | boolean | Date | unknown;

export type Filter<Model extends HasId> =
  | Record<keyof Model, unknown>
  | ObjectRecord;

export type Pagination = {
  pageIndex: number;
  pageSize: number;
};

export type Sort<Model> =
  | [keyof Model, SortDirection]
  | [string, SortDirection];

export type GetManyModel<
  Model extends HasId = HasId,
  F extends Filter<Model> = Filter<HasId>
> = {
  filter?: F;
  pagination?: Pagination;
  sort?: Sort<Model>;
};

/**
 * Default model for cms
 */
export type GetManyDefaultModel = GetManyModel<HasId, Filter<HasId>>;

export type GetManyPagedResult<Model extends HasId = HasId> = {
  models: Model[];
  totalCount: number;
};
