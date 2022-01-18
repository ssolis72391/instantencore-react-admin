import { WhereOptions } from "sequelize";
import { loggerFactory } from "../core";
import { destroyOneByIdFactory } from "./factories/destroyOneByIdFactory";
import { Page, Program } from "./models";
import { sequelize } from "./sequelize";

export const detroyOneProgram = destroyOneByIdFactory({
  name: "detroyOneProgram",
  innerDestroyOne: async (model) => {
    const logger = loggerFactory("detroyOneProgram");
    const { id } = model;

    const [[count]] = await sequelize.transaction(async (transaction) => {
      const utcNow = new Date();
      const where: WhereOptions<Program> = { id };
      return await Promise.all([
        Program.update({ deletedAt: utcNow, status: "deleted" }, { where }),
        Page.update({ deletedAt: utcNow, status: "deleted" }, { where }),
      ]);
    });

    return count;
  },
});
