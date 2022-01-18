import { GetManyPagedResult, HasId } from "api-shared";
import { Op } from "sequelize";
import { loggerFactory } from "../core";
import { ReadManyModel } from "../core/database";
import { ReadManyUsingSequelizeModel } from "./factories";
import {
  componentHasManyCards,
  PageComponent,
  pageComponentHasOneComponent,
  Program,
  programBelongsToPage,
} from "./models";

function like(value: string): string {
  return `%${value}%`;
}

export type ReadManyProgramsUsingSequelizeModel = ReadManyUsingSequelizeModel<
  Program,
  {
    text?: string;
    localStartDateGte?: string;
    localEndDateLte?: string;
    utcEndDateGte?: string;
    utcEndDateLt?: string;
    deleted: boolean;
    /**
     * @TODO are we using this? if not delete
     */
    dateRange?: boolean;
    clientId?: number;
  }
>;

export const readManyProgramsUsingSequelize: (
  model: ReadManyProgramsUsingSequelizeModel
) => Promise<
  ReadManyProgramsUsingSequelizeModel extends ReadManyModel<infer Model>
    ? GetManyPagedResult<Model>
    : GetManyPagedResult<HasId>
> = async (model) => {
  const logger = loggerFactory("readManyProgramsUsingSequelize");

  const { filter, pagination, sort } = model;
  const { pageIndex, pageSize } = pagination;
  const [key, direction] = sort;

  const {
    text,
    localStartDateGte,
    localEndDateLte,
    deleted,
    dateRange,
    utcEndDateGte,
    utcEndDateLt,
    clientId,
  } = filter;

  logger.debug(JSON.stringify(model));

  const rootAnd = [];
  const where: any = { [Op.and]: rootAnd };

  const trimmedText = text?.trim();
  if (trimmedText) {
    const words = trimmedText
      .split(" ")
      .map((item) => item.trim())
      .filter((item) => !!item.length);
    if (words.length > 1) {
      const and = [];
      rootAnd.push({ [Op.and]: and });
      words.forEach((item) => {
        and.push({
          [Op.or]: [
            {
              ["$page.internalName$"]: {
                [Op.like]: like(item),
              },
            },
            {
              season: {
                [Op.like]: like(item),
              },
            },
          ],
        });
      });
    } else {
      rootAnd.push({
        [Op.or]: [
          {
            ["$page.internalName$"]: {
              [Op.like]: like(trimmedText),
            },
          },
          {
            season: {
              [Op.like]: like(trimmedText),
            },
          },
        ],
      });
    }
  }

  if (utcEndDateGte) {
    where.utcEndDate = { [Op.gte]: utcEndDateGte };
  }
  if (utcEndDateLt) {
    where.utcEndDate = { [Op.lt]: utcEndDateLt };
  }

  if (dateRange) {
    where.localStartDate = { [Op.lte]: localEndDateLte };
    where.localEndDate = { [Op.gte]: localStartDateGte };
  } else {
    if (localStartDateGte) {
      where.localStartDate = { [Op.gte]: localStartDateGte };
    }
    if (localEndDateLte) {
      where.localEndDate = { [Op.lte]: localEndDateLte };
    }
  }

  if (clientId) {
    where.clientId = clientId;
  }

  const dir = direction.toUpperCase();

  const { rows: models, count: totalCount } = await Program.findAndCountAll({
    order:
      key === "internalName"
        ? [[programBelongsToPage, "internalName", dir]]
        : [[key, dir]],
    offset: pageIndex * pageSize,
    limit: pageSize,
    where,
    include: [
      {
        required: true,
        paranoid: !deleted,
        association: programBelongsToPage,
      },
    ],
    paranoid: !deleted,
  });

  //  we have to do a 2nd query to avoid the issue documented here: https://stackoverflow.com/questions/69592146/sequelizedatabaseerror-unknown-column-b-belongs-to-a-name-in-order-clause
  const pageComponents = await PageComponent.findAll({
    where: { pageId: models.map((item) => item.id) },
    include: {
      association: pageComponentHasOneComponent,
      include: [{ association: componentHasManyCards }],
    },
  });

  models
    .map((item) => item.page)
    .forEach((page) => {
      page.pageComponents = pageComponents.filter((pc) => pc.pageId == page.id);
    });

  return {
    models,
    totalCount,
  };
};
