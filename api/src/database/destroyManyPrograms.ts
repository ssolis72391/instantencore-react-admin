import { Program } from "./models";

export const destroyAllPrograms = async (params: {
  hardDestroy: boolean;
}): Promise<number> => {
  const { hardDestroy } = params;
  return await Program.destroy({
    where: {},
    // mysql only
    truncate: true,
    force: hardDestroy,
  });
};
