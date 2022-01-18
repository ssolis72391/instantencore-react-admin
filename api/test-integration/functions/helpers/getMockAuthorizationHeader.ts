export const getMockAuthorizationHeader = () => {
  const authToken = {
    cid: "1",
    name: "Test name",
  };
  return {
    Authorization: `Bearer ${JSON.stringify(authToken)}`,
  };
};
