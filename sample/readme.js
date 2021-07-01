const {strict: Assert} = require("assert");
const {parse, stringify} = require("../lib/main.js");
const markers = "*-" // enable each character to be used as a marker
const string1 = [
  "* foo",
  "* - bar",
  "  - qux",
].join("\n");
const node1 = parse(string1, markers);
const node2 = [
  "*",
  [
    "foo",
    [
      "-",
      [
        "bar",
        "qux"
      ]
    ]
  ]
];
const string2 = stringify(node2, markers);
Assert.deepEqual(node1, node2);
Assert.equal(string1, string2);
