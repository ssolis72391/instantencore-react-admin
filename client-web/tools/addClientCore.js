const _package = require("../package.json");
var exit = require("process").exit;
const { execSync } = require("child_process");

const dep = _package.dependencies["@instantencore/digital-program-book"];

const version = process.argv[2];
switch (version) {
  case "local":
    addLocal();
    break;
  case "latest":
    addLatest();
    break;
  default:
    console.error(
      "You need to pass a valid version parameter. Eg: node tools/addClientCore.js [local|latest]"
    );
    exit(1);
}

function run(command) {
  execSync(command, {
    stdio: "inherit",
  });
}
function addLocal() {
  if (!dep || dep.indexOf("link:") === -1) {
    run("yarn add link:../client-core");
  }
  exit(0);
}

function addLatest() {
  // todo: check if itrs neccesary to reinstall based on the lates available version
  run("yarn add @instantencore/digital-program-book@latest");
  exit(0);
}
