import {
  GetManyPagedResult,
  HasId,
  PostOneProgramModel,
  ProgramModel,
  ProgramStatusKey,
  rfc3339_dateonly_format,
} from "api-shared";
import * as dayjs from "dayjs";
import { destroyAllPrograms } from "../src/database/destroyManyPrograms";
import { deleteOneProgram } from "../src/functions/deleteOneProgram";
import {
  getOneProgram,
  handler as getManyPrograms,
} from "../src/functions/getPrograms";
import { postOneProgram } from "../src/functions/postOneProgram";
import { putRestoreOneProgram } from "../src/functions/putRestoreOneProgram";
import { parseJson, toJson } from "../test-tools";

describe("program lifecycle", () => {
  it("creates, deletes and restores a program", async () => {
    await destroyAllPrograms({ hardDestroy: true });

    const now = dayjs();

    const headers = {
      Authorization: `Bearer ${JSON.stringify({ cid: 1 })}`,
    };

    const createResult = await postOneProgram({
      httpMethod: "POST",
      resource: "/programs",
      body: toJson<PostOneProgramModel>({
        headerTitle: "test",
        localStartDate: now.subtract(1, "day").format(rfc3339_dateonly_format),
        localEndDate: now.format(rfc3339_dateonly_format),
        timeZone: "America/Lima",
      }),
      headers,
    });

    const createResultModel = parseJson<HasId>(createResult.body);
    const { id } = createResultModel;

    await deleteOneProgram({
      httpMethod: "DELETE",
      resource: "/programs/{id}",
      pathParameters: { id: id.toString() },
    });

    const getOneResult1 = await getOneProgram({
      httpMethod: "GET",
      resource: "/programs/{id}",
      pathParameters: { id: id.toString() },
      queryStringParameters: { deleted: "true" },
    });
    (() => {
      const { body, statusCode } = getOneResult1;
      expect(statusCode).toBe(200);
      const model = parseJson<ProgramModel>(body);
      expect(model.status).toBe<ProgramStatusKey>("deleted");
    })();

    const putRestoreResult = await putRestoreOneProgram({
      httpMethod: "PUT",
      resource: "/programs/{id}/restore",
      pathParameters: { id: id.toString() },
    });

    (() => {
      const { statusCode, body } = putRestoreResult;
      expect(statusCode).toBe(200);
      expect(body).toBeTruthy();
      const model = parseJson<HasId>(body);
      expect(model.id).toStrictEqual(id);
    })();

    const getOneResult2 = await getOneProgram({
      httpMethod: "GET",
      resource: "/programs/{id}",
      pathParameters: { id: id.toString() },
    });
    (() => {
      const { body } = getOneResult2;
      const model = parseJson<ProgramModel>(body);
      expect(model.status).toBe<ProgramStatusKey>("draft");
    })();
  });

  it.skip("creates with start date today, gets and validates fulture date filter works", async () => {
    await destroyAllPrograms({ hardDestroy: true });

    const now = dayjs();

    const headers = {
      Authorization: `Bearer ${JSON.stringify({ cid: 1 })}`,
    };

    const createResult = await postOneProgram({
      httpMethod: "POST",
      resource: "/programs",
      body: toJson<PostOneProgramModel>({
        headerTitle: "test",
        localStartDate: now.subtract(1, "day").format(rfc3339_dateonly_format),
        localEndDate: now.format(rfc3339_dateonly_format),
        timeZone: "America/Lima",
      }),
      headers,
    });
    expect(createResult.statusCode).toBe(201);
    const createResultModel = parseJson<HasId>(createResult.body);
    const { id: newId } = createResultModel;
    expect(newId).toBeGreaterThan(0);

    const getResult1 = await getManyPrograms({
      httpMethod: "GET",
      resource: "/programs",
      queryStringParameters: {
        "filter[dateFilter]": "future",
        "pagination[pageIndex]": "0",
        "pagination[pageCount]": "10",
      },
      multiValueQueryStringParameters: {
        sort: ["id", "asc"],
      },
      headers,
    });
    expect(getResult1.statusCode).toBe(200);
    expect(getResult1.body).toBeTruthy();
    const readManyResult1 = parseJson<GetManyPagedResult<ProgramModel>>(
      getResult1.body
    );

    const {
      models: {
        [0]: { id },
      },
      totalCount,
    } = readManyResult1;

    expect(totalCount).toBe(1);
    expect(id).toBe(newId);
  });
});
