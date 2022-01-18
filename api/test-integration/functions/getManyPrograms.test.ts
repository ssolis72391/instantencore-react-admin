import {
  GetManyPagedResult,
  HasId,
  PostOneProgramModel,
  ProgramModel,
  rfc3339_dateonly_format,
} from "api-shared";
import { APIGatewayProxyEventHeaders } from "aws-lambda";
import * as dayjs from "dayjs";
import * as dotenv from "dotenv";
import { forEachAsync } from "../../src/core/core";
import { destroyAllPrograms } from "../../src/database/destroyManyPrograms";
import { getManyPrograms } from "../../src/functions/getPrograms";
import { handler as postOneProgram } from "../../src/functions/postOneProgram";
import { parseJson, toJson } from "../../test-tools";
import { getMockAuthorizationHeader } from "./helpers/getMockAuthorizationHeader";

dotenv.config();

describe("getManyPrograms", () => {
  it.skip("works", async () => {
    const headers = getMockAuthorizationHeader();
    const { statusCode, body } = await getManyPrograms({
      httpMethod: "GET",
      resource: "/programs",
      //  todo: create an OAS 3.0 complaint stringifier for objects
      queryStringParameters: {
        "pagination[pageIndex]": "257",
        "pagination[pageSize]": "10",
        "filter[dateFilter]": "all",
        "filter[text]": "a",
        "filter[deleted]": "true",
      },
      multiValueQueryStringParameters: { sort: ["id", "asc"] },
      headers,
    });
    expect(statusCode).toEqual(200);
    expect(body).toBeTruthy();
  });

  it("sorts by internalName", async () => {
    await destroyAllPrograms({ hardDestroy: true });

    const now = dayjs().format(rfc3339_dateonly_format);

    const postModelBase: PostOneProgramModel = {
      localStartDate: now,
      localEndDate: now,
      timeZone: "America/Lima",
    };
    const postModels: PostOneProgramModel[] = [
      { ...postModelBase, headerTitle: "z" },
      { ...postModelBase, headerTitle: "a" },
      { ...postModelBase, headerTitle: "a" },
      { ...postModelBase, headerTitle: "e" },
      { ...postModelBase, headerTitle: "F" },
      { ...postModelBase, headerTitle: "b" },
    ];

    const headers: APIGatewayProxyEventHeaders = {
      Authorization: `Bearer ${toJson({ cid: 1 })}`,
    };

    const results = await forEachAsync(postModels, async (item) => {
      const {
        statusCode,
        body,
        headers: responseHeaders,
      } = await postOneProgram({
        httpMethod: "POST",
        resource: "/programs",
        body: toJson(item),
        headers,
      });
      return {
        model: parseJson<HasId>(body),
        statusCode,
        headers: responseHeaders,
      };
    });

    results.forEach((item) => {
      const {
        headers,
        model: { id },
        statusCode,
      } = item;
      expect(headers).toBeTruthy();
      expect(id).toBeGreaterThan(0);
      expect(statusCode).toBe(201);
    });

    const getResult1 = await getManyPrograms({
      httpMethod: "GET",
      resource: "/programs",
      queryStringParameters: {
        "filter[dateFilter]": "all",
        "pagination[pageIndex]": "0",
        "pagination[pageCount]": "10",
      },
      multiValueQueryStringParameters: {
        sort: ["internalName", "asc"],
      },
      headers,
    });
    expect(getResult1.statusCode).toBe(200);
    expect(getResult1.body).toBeTruthy();
    const { models, totalCount } = parseJson<GetManyPagedResult<ProgramModel>>(
      getResult1.body
    );

    expect(totalCount).toBe(postModels.length);
    expect(models.map((item) => item.internalName)).toMatchObject(
      postModels
        .map((item) => item.headerTitle)
        .sort((a, b) => {
          const _a = a.toLowerCase();
          const _b = b.toLowerCase();
          return _a < _b ? -1 : _a < _b ? 1 : 0;
        })
    );
  });
});
