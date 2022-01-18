import { ProgramModel } from "api-shared";
import { createOneFactory } from "./factories";
import { Page, Program } from "./models";

export const createOneProgram = createOneFactory<ProgramModel>({
  name: "createOneProgram",
  innerCreateOne: async (model) => {
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
      components,
      headerImageUrl,
      headerPreTitle,
      headerSubTitle,
      headerTitle,
      internalNotes,
      season,
      source,
      sourceId,
      venue,
      clientId,
    } = model;
    const transaction = await Page.sequelize.transaction();
    try {
      const { id } = await Page.create(
        {
          headerImageSize,
          headerTextPosition,
          internalName,
          headerImageUrl,
          headerPreTitle,
          headerSubTitle,
          headerTitle,
          status: "ok",
        },
        { transaction }
      );
      await Program.create(
        {
          id,
          localEndDate,
          localStartDate,
          status,
          timeZone,
          utcEndDate,
          utcStartDate,
          internalNotes,
          season,
          source,
          sourceId,
          venue,
          clientId,
        },
        { transaction }
      );
      transaction.commit();
      return id;
    } catch (error) {
      transaction.rollback();
      throw error;
    }
  },
  resultMapper: (result) => result,
});
