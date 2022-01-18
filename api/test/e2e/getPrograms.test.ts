//  todo: uncomment
// import {
//   postOneTextImageComponentModel,
//   ProgramModel,
//   Styles,
// } from "api-shared";
// import * as dotenv from "dotenv";
// import * as faker from "faker";
// import { deleteOneComponent } from "../../src/lambdas/deleteOneComponent";
// import { handler as getPrograms } from "../../src/lambdas/get-programs";
// import {
//   handler as postOneProgram,
//   ImageDataType,
//   PostOneProgramModel,
// } from "../../src/lambdas/post-program";
// import { postOneTextImageComponent } from "../../src/lambdas/postOneComponent";
// const { error, parsed } = dotenv.config();

// if (!error) {
//   console.info({ parsed });
// }

// describe("getPrograms", () => {
//   it("Includes soft deleted components", async () => {
//     const postProgramModel: PostOneProgramModel = {
//       image: { data: faker.image.imageUrl(), type: ImageDataType.Url },
//       localStartDate: "2021-10-01",
//       localEndDate: "2021-10-02",
//       orgId: 1,
//       timeZone: "America/New_York",
//       title: faker.name.title(),
//     };
//     const postProgramResult = await postOneProgram({
//       httpMethod: "GET",
//       resource: "/programs",
//       body: JSON.stringify(postProgramModel),
//     });

//     console.info({ postProgramResult });

//     const { id } = JSON.parse(postProgramResult.body);

//     const postComponentModel: postOneTextImageComponentModel = {
//       details: "link",
//       display: "always",
//       name: faker.name.title(),
//       styling: faker.random.objectElement(Styles) as Styles,
//       type: "textImage",
//       detailsLink: faker.internet.url(),
//       programId: id,
//       title: faker.name.title(),
//     };

//     const postComponentResult = await postOneTextImageComponent({
//       body: JSON.stringify(postComponentModel),
//       httpMethod: "POST",
//       resource: "/components",
//     });

//     const { id: componentId } = JSON.parse(postComponentResult.body);

//     await deleteOneComponent({
//       httpMethod: "DELETE",
//       resource: "/components/{id}",
//       pathParameters: { id: componentId },
//     });

//     const getProgramsResult = await getPrograms({
//       httpMethod: "GET",
//       resource: "/programs/{id}",
//       pathParameters: {
//         id,
//       },
//     });

//     const { components } = JSON.parse(getProgramsResult.body) as ProgramModel;

//     expect(components).toBeTruthy();
//     expect(components).toHaveLength(1);

//     //  todo: cleanup
//   });
// });
