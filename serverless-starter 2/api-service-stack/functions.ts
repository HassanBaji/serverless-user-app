import { readFileSync } from "fs";

import yml from "js-yaml";

const files = [
  readFileSync("./src/users/usersFunctions.yml"),
  readFileSync("./src/authorization/authFunctions.yml"),
];

export default files.reduce((res, row) => {
  const data = yml.load(row);

  for (const [key, val] of Object.entries<any>(data)) {
    res[key] = { ...res[key], ...val };
  }

  return res;
}, {});
