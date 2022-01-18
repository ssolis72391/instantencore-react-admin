import { ProgramStatusKey } from "api-shared";
import { Op, WhereOptions } from "sequelize";
import { loggerFactory } from "../../core";
import { Program } from "../models";

export async function readProgramCount({
  id,
  status,
}: {
  id: number;
  status?: ProgramStatusKey | ProgramStatusKey[] | "all";
}): Promise<number> {
  const logger = loggerFactory("readProgramCount");

  const where: WhereOptions<Program["_attributes"]> = {
    id,
  };

  if (status && status !== "all") {
    if (Array.isArray(status)) {
      where.status = {
        [Op.or]: status,
      };
    }
  }

  return await Program.count({
    where,
    benchmark: true,
    logging: (sql, ms) => logger.debug(JSON.stringify({ sql, ms })),
    paranoid:
      status === "deleted" ||
      (Array.isArray(status) && status.includes("deleted")),
  });
}
