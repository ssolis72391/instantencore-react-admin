import fetch from 'node-fetch';
import Validator from "validatorjs";
import dotenv from "dotenv";

dotenv.config();

const { exit } = process;

function getEnvVar(name: string) {
    const value = process.env.name;
    if (!value) {
        console.error(`Missing or invalid ${name} env var!`);
        exit(1);
    }
    return value;
}

const clubhouse_api_token = getEnvVar("CLUBHOUSE_API_TOKEN");

const apiBasePath = "https://api.clubhouse.io/api/v3";

//  todo: get some values from env
const my_id = getEnvVar("CLUBHOUSE_MY_ID");
const epic_state_id = 500024565;
const group_id = "5eab0ce2-b853-46c7-9e89-1798cd3725b2";
const milestone_id = 78178;
const name = process.argv[2];
const description = process.argv[3];

const body = { description, epic_state_id, follower_ids: [my_id], group_id, labels: [{ color: "#e885d1", name: "InstantEncore" }], milestone_id, name, owner_ids: [my_id], requested_by_id: my_id };

const validator = new Validator(body, {
    description: ["string"], name: ["string", "required"],
});
if (validator.fails()) {
    console.error(validator.errors.errors);
    exit(1);
}

body.name = `DPB: ${name}`;

type Response =
    {
        app_url: string;
    }

(async () => {
    const result = await fetch(`${apiBasePath}/epics`, { method: "POST", headers: { "Clubhouse-Token": clubhouse_api_token, "Content-Type": "application/json" }, body: JSON.stringify(body) });

    const data = await result.json();

    if (result.ok) {
        console.info("Epic was created. You can visit it using the following URL:")
        console.info((data as Response).app_url);
        exit(0);
    } else {
        console.error(data);
        exit(1);
    }
})();