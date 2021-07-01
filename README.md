# list-lang

List language to parse and serialize lists with configurable bullets.

* Inspired from yaml and sexpr
* Configurable bullets
* Atomic datatype restricted to strings

## Example 1

```txt
* foo
* - bar
  - qux
```

```json
["*", [
    "foo",
    ["-", [
        "bar",
        "qux"]]]]
```
 

## Example 2

```txt
# Comment
  # Indented Comment  
* item
* spaced item
* \* marker-escaped item
* endline-escaped item\n
* - nested item1
  - nested item2
  - - deeply nested item1
    - deeply nested item2
```

```json
[
  "*",
  [
    "item",
    "spaced item",
    "* marker-escaped item",
    "endline-escaped item\n",
    [
      "-",
      [
        "nested item1",
        "nested item2",
        [
          "-",
          [
            "deeply nested item1",
            "deeply nested item2"
          ]
        ]
      ]
    ]
  ]
]
```

## API

```js
const {strict: Assert} = require("assert");
const {parse, stringify} = require("list-lang");
const markers = "*-" // Enable each character to be used as a bullet marker
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
```
