// import { ProgramModel } from "api-shared";
// import { ProgramDalModel } from "../database/models/Program";

// const programMapper = {
//   mapLambdaToDbModel(source: Partial<ProgramModel>): Partial<ProgramDalModel> {
//     // todo: update and uncomment
//     // const {
//     //   notes,
//     //   preTitle,
//     //   subTitle,
//     //   orgId,
//     //   name,
//     //   imageUrl,
//     //   timeZone,
//     //   title,
//     //   id,
//     //   season,
//     //   status,
//     //   localEndDate,
//     //   localStartDate,
//     //   utcEndDate,
//     //   utcStartDate,
//     // } = source;
//     // return {
//     //   notes,
//     //   preTitle,
//     //   subTitle,
//     //   orgId,
//     //   name,
//     //   imageUrl,
//     //   timeZone,
//     //   title,
//     //   localEndDate,
//     //   localStartDate,
//     //   utcEndDate,
//     //   utcStartDate,
//     //   id,
//     //   season,
//     //   status,
//     // };
//     return undefined;
//   },

//   mapDbToLambdaModel(source: ProgramDalModel): ProgramModel {
//     // todo: update and uncomment
//     // const {
//     //   notes,
//     //   preTitle,
//     //   subTitle,
//     //   orgId,
//     //   name,
//     //   imageUrl,
//     //   timeZone,
//     //   title,
//     //   id,
//     //   season,
//     //   deletedAt,
//     //   status,
//     //   localEndDate,
//     //   localStartDate,
//     //   utcEndDate,
//     //   utcStartDate,
//     //   components,
//     // } = source;

//     // return {
//     //   notes,
//     //   preTitle,
//     //   subTitle,
//     //   orgId,
//     //   name,
//     //   imageUrl,
//     //   localEndDate,
//     //   localStartDate,
//     //   timeZone,
//     //   title,
//     //   utcEndDate,
//     //   utcStartDate,
//     //   id,
//     //   season,
//     //   status: status as ProgramStatus,
//     //   isDeleted: !!deletedAt,
//     //   //  todo: ensure this works (getting values from _attributes)
//     //   components: components?.map(({ id, name, type, deletedAt }) => {
//     //     return {
//     //       styling: faker.random.objectElement(Styles) as Styles,
//     //       display:
//     //         faker.datatype.number({ min: 0, max: 2 }) === 0
//     //           ? "always"
//     //           : Math.random() === 0
//     //           ? "excludeSometimes"
//     //           : "includeSometimes",
//     //       id,
//     //       name,
//     //       type,
//     //       deletedAt,
//     //       dates: [
//     //         {
//     //           id: faker.datatype.number({ min: 1, max: 255 }),
//     //           localStartDate: "2021-12-01",
//     //           localEndDate: "2021-12-02",
//     //           utcEndDate: "2021-12-02",
//     //           utcStartDate: "2021-12-01",
//     //           timeZone: "America/New_York",
//     //         },
//     //       ],
//     //     };
//     //   }),
//     // };
//     return undefined;
//   },
// };

// export { programMapper };
