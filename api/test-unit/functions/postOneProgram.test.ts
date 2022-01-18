jest.mock("../../src/database/createOneProgram");
jest.mock("../../src/core/getClientIdFromHeader");
import { HasId, PostOneProgramModel, TimeZoneProvider } from "api-shared";
import { getClientIdFromHeader } from "../../src/core/getClientIdFromHeader";
import { createOneProgram } from "../../src/database/createOneProgram";
import { postOneProgram } from "../../src/functions/postOneProgram";
import { getMockedFunction, parseJson } from "../../test-tools";

getMockedFunction(getClientIdFromHeader).mockImplementation(() => 1);

getMockedFunction(createOneProgram).mockImplementation(() =>
  Promise.resolve(1)
);

describe("postOneProgram", () => {
  describe("works with all timezones", () => {
    it.each(TimeZoneProvider.getAllNames().map((e) => [e]))(
      'works with timezone "%s"',
      async (timeZone) => {
        const postModel: PostOneProgramModel = {
          localEndDate: "2021-12-02",
          localStartDate: "2021-12-02",
          timeZone,
          clientId: 1,
          headerImageUrl: "",
          headerTitle: "A title",
          season: "A season",
        };
        const { statusCode, body } = await postOneProgram({
          httpMethod: "POST",
          resource: "/programs",
          body: JSON.stringify(postModel),
        });
        expect(statusCode).toBe(201);
        expect(body).toBeTruthy();
        expect(parseJson<HasId>(body).id).toBe(1);
      }
    );
  });
});
