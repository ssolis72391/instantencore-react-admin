import { HasId, Remove } from "api-shared";
import { UpdateOptions } from "sequelize";
import { id, truthy } from "../core/validation";
import { ProgramValues } from "../values";
import { updateOneByIdFactory } from "./factories";
import { Page, Program } from "./models";
import sequelize, { RemoveSequelizeModelProps } from "./sequelize";

export const updateOneProgram = updateOneByIdFactory<
  Partial<ProgramValues>,
  {
    program: Partial<Remove<RemoveSequelizeModelProps<Program>, "id">>;
    page: Partial<Remove<RemoveSequelizeModelProps<Page>, "id">>;
  }
>({
  name: "updateOneProgram",
  updateOneByIdModelValidator: { id: id(), model: truthy() },
  innerUpdateOneByIdModelMapper: ({ id, model }) => {
    const {
      headerImageSize,
      headerTextPosition,
      internalName,
      localEndDate,
      localStartDate,
      status,
      timeZone,
      utcEndDate,
      utcStartDate,
      headerImageUrl,
      headerPreTitle,
      headerSubTitle,
      headerTitle,
      internalNotes,
      season,
      venue,
    } = model;

    return {
      id,
      model: {
        program: {
          localStartDate,
          deletedAt:
            status !== undefined
              ? status === "deleted"
                ? new Date()
                : null
              : undefined,
          internalNotes,
          localEndDate,
          season,
          status,
          timeZone,
          utcEndDate,
          utcStartDate,
          venue,
        },
        page: {
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
          status: status === "deleted" ? "deleted" : "ok",
        },
      },
    };
  },
  innerUpdateOneById: async ({ id, model }) => {
    const { program, page } = model;

    const result = await sequelize.transaction(async (transaction) => {
      const updateOptions: UpdateOptions<HasId> = {
        paranoid: false,
        where: { id },
        transaction,
      };
      const result1 = await Program.update(program, updateOptions);
      const result2 = await Page.update(page, updateOptions);
      return [result1[0], result2[0]];
    });

    return result.reduce((a, b) => a + b);
  },
});
