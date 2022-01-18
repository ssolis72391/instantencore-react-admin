import { readProgramCount } from "../database/programs/readProgramCount";

export const programService = {
  async exists({ id }: { id: number }) {
    return (
      (await readProgramCount({
        id,
        status: "all",
      })) > 0
    );
  },
};
