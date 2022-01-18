import { GetManyProgramsModel } from "api-shared";
import { getCurrentRfc3339FullUtcDate, truthy } from "../core";
import { readManyFactory } from "./factories";
import { programMapper } from "./programMapper";
import { readManyProgramsUsingSequelize } from "./readManyProgramsUsingSequelize";

/**
 * @TODO is this good enough? if not remove
 */
export function getValueOnTruthyOrUndefinedOnFalsy<T, V>(
  value: T,
  newValue: V
): V {
  return !value ? undefined : newValue;
}

export const readManyPrograms = readManyFactory<GetManyProgramsModel>({
  getManyModelValidators: {
    filter: truthy(),
    pagination: truthy(),
    sort: truthy(),
  },
  innerReadMany: async (model) => {
    const { filter, pagination, sort } = model;
    const {
      dateFilter,
      deleted,
      localEndDate,
      localStartDate,
      text,
      clientId,
    } = filter;

    const utcToday = getCurrentRfc3339FullUtcDate();

    const result = await readManyProgramsUsingSequelize({
      filter: {
        dateRange: dateFilter === "custom",
        deleted,
        text,
        utcEndDateGte: getValueOnTruthyOrUndefinedOnFalsy(
          dateFilter === "future",
          utcToday
        ),
        utcEndDateLt: getValueOnTruthyOrUndefinedOnFalsy(
          dateFilter === "past",
          utcToday
        ),
        localEndDateLte: dateFilter === "custom" ? localEndDate : undefined,
        localStartDateGte: dateFilter === "custom" ? localStartDate : undefined,
        clientId,
      },
      pagination,
      sort,
    });

    const { models, totalCount } = result;

    return {
      totalCount,
      models: models.map(programMapper),
    };
  },
  name: "readManyPrograms",
});
