/**
 * @todo uncomment and update
 */
const getLatestProgramTimeZone = async (orgId: number): Promise<string> => {
  // const { timeZone } = await Program.findOne<Program>({
  //   where: { orgId },
  //   order: [["id", "DESC"]],
  //   attributes: ["timeZone"],
  // });
  // return timeZone;
  return "America/Lima";
};

export { getLatestProgramTimeZone };
