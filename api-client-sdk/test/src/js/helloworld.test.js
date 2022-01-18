import dotenv from "dotenv";
import ApiClient from "../../../src/js/main";

dotenv.config();
const apiClient = new ApiClient();

apiClient.setEndPoint("https://dpb-api.zach.instantencore.com/1")
//apiClient.setAPIKey(process.env.X_API_KEY);

describe("client helloworld", () => {
  it("should return data", async () => {
    const response = await apiClient.read("helloworld");

    expect(response).toMatchSnapshot();

    expect(response).toMatchSnapshot({
      id: expect.any(Number),
      value: "Hello world 1 from api"
    });
  });
});
