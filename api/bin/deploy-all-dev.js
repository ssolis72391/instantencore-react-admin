/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs/promises");
const { execSync, exec } = require("child_process");
const testFolder = `${__dirname}/../src/functions`;

const functionsPrefixes = ["get", "put", "post", "delete", "undelete"];
(async () => {
  const items = await fs.readdir(testFolder, { withFileTypes: true });
  await Promise.all(
    items
      .filter(
        (item) =>
          item.isFile() &&
          functionsPrefixes.some((prefix) => item.name.startsWith(prefix))
      )
      .map((item) => {
        const lambda = item.name.replace(".ts", "");
        return new Promise((resolve, reject) => {
          const cmd = `${__dirname}/update_lambda.sh ${lambda}`;

          exec(cmd, (error, stdout, stderr) => {
            if (error) {
              reject(error);
            } else if (stderr) {
              reject(`Error deploying lambda ${lambda}: ${stderr}`);
            } else {
              console.log(stdout);
              resolve();
            }
          });
        });
      })
  ).then(
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    () => {},
    (error) => console.error(error)
  );
})();
