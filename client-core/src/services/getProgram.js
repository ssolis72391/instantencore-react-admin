import getAppConfig from "../common/getAppConfig";
import programJson from "../mocks/program-test.json";

const getProgram = async (id) => {
  const appConfig = await getAppConfig();
  // hardCode to use api data for now. We will make this an option in ch100867
  if (appConfig.useMocks) {
    return programJson;
  } else {
    // https://dpb-api.evan.instantencore.com/1/evan/programs/22
    const url = `${appConfig.apiBasePath}/client/programs/${id}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
};

export default getProgram;
