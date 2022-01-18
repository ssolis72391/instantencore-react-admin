import { ProgramModel } from "api-shared";
import { ReadOneByIdModel } from "../core";
import { readOneByIdFactory } from "./factories";
import { Program } from "./models";
import { programMapper } from "./programMapper";

export const readOneProgram = readOneByIdFactory<
  ProgramModel,
  ReadOneByIdModel<ProgramModel>,
  Program
>({
  name: "readOneProgram",
  innerReadByOneById: async (model) => {
    const { id, deleted } = model;
    const result = await Program.findOne({
      where: { id },
      paranoid: !deleted,
      include: [
        {
          association: "page",
          paranoid: !deleted,
          include: [
            {
              association: "pageComponents",
              paranoid: !deleted,
              include: [
                {
                  association: "component",
                  include: ["cards"],
                },
              ],
            },
          ],
        },
      ],
    });
    return result;
  },
  modelMapper: programMapper,
});
