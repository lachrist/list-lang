const FileSystem = require("fs");
const ListLang = require("../lib/main.js");

console.log(
  JSON.stringify(
    ListLang.parse(
      FileSystem.readFileSync(`${__dirname}/sample.list`, "utf8"),
      "*-"
    ),
    null,
    2,
  ),
);
