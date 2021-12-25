const { strict: Assert } = require("assert");
const { parse, stringify } = require("./main.js");

const { throws: assertThrow, deepEqual: assertDeepEqual } = Assert;

assertThrow(() => parse("foo", 123));

const test = (node) => {
  assertDeepEqual(node, parse(stringify(node)));
};

test("");

test("foo");

test("foo\r\n");

test("*foo");

test("#foo");

test(["-", ["foo", "bar"]]);

test(["-", [["*", ["foo", "bar"]], "qux"]]);
