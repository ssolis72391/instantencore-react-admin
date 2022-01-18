type defaultHeaders = {
  "Access-Control-Allow-Headers": string;
  "Access-Control-Allow-Origin": string;
  "Access-Control-Allow-Methods": string;
};

const programsHeaders: defaultHeaders = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
};

const oneProgramHeaders: defaultHeaders = {
  ...programsHeaders,
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET,DELETE,PUT",
};

export { programsHeaders, oneProgramHeaders };
