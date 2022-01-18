import getAppConfig from "../common/getAppConfig";
import programsJson from "../mocks/programs.json";

const getPrograms = async () => {
  const appConfig = await getAppConfig();
  // hardCode to use api data for now. We will make this an option in ch100867
  if (appConfig.useMocks) {
    return programJson;
  } else {
    // https://dpb-api.evan.instantencore.com/1/client/programs
    const url = `${appConfig.apiBasePath}/client/programs?cid=${appConfig.cid}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
};

export default getPrograms;
