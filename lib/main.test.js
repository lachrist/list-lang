const { strict: Assert } = require("assert");
const { parse, stringify } = require("./main.js");

Assert.throws(() => parse("", 123));

const test = (node) => {
  Assert.deepEqual(node, parse(stringify(node)));
};

test("");

test("foo");

test("f\\o");

test("foo\n");

test("*foo");

test(["-", ["foo", "bar"]]);

test(["-", [["*", ["foo", "bar"]], "qux"]]);
