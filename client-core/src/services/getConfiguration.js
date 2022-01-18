import getAppConfig from "../common/getAppConfig";
import configurationJson from "../mocks/configuration-empty.json";

const getConfiguration = async () => {
  return configurationJson;
  // // todo: remove hardcoded params
  // // `${
  // //   (await getAppConfig()).apiBasePath
  // // }/programs?_start=0&_end=10&_sort=title&_order=ASC`;
  // const response = await fetch(url);
  // const data = await response.json();
  // return data;
};

export default getConfiguration;
