
const Util = require("util");

const assert = (boolean, template, ...values) => {
  if (!boolean) {
    throw new Error(Util.format(template, ... values));
  }
}

const forbidden = "n\\#";

const checkMarkerString = (markers) => {
  assert(
    typeof markers === "string",
    "marker list should be a string, got: %o",
    markers,
  );
  for (let marker of markers) {
    assert(!forbidden.includes(marker), "forbidden marker %o", marker);
  }
};

///////////////
// stringify //
///////////////

const escape = (match) => `\\${match === "\n" ? "n" : match}`;

exports.stringify = (node, markers = "*-") => {
  checkMarkerString(markers);
  return stringifyLoop(node, markers).join("\n");
};

const stringifyLoop = (node, markers) => {
  if (typeof node === "string") {
    node = node.replace(/[\n\\]/gu, escape);
    if (markers.includes(node[0])) {
      node = `\\${node}`;
    }
    return [node];
  }
  assert(
    Array.isArray(node) && node.length === 2,
    "node should either be a string or an array of two elements, got: %o",
  );
  const [marker, nodes] = node;
  assert(
    marker.length === 1 && markers.includes(marker),
    "the first element of an array node should be the list marker, got: %o",
    marker,
  );
  assert(
    Array.isArray(nodes) && nodes.length > 0,
    "the second element of an array node should be a non empty array, got: %o",
    nodes,
  );
  const itemizeLine = (line, index) => `${index === 0 ? marker : " "} ${line}`;
  return nodes.flatMap((node) => stringifyLoop(node, markers).map(itemizeLine));
};

///////////
// parse //
///////////

const isNotEmpty = (line) => !/^ *(#.*)?$/gu.test(line);

const unescape = (match) => (match === "\\n" ? "\n" : match[1]);

exports.parse = (content, markers = "*-") => {
  checkMarkerString(markers);
  assert(
    typeof content === "string",
    "content should be a string, got: %o",
    content,
  );
  return parseLoop(content.split("\n").filter(isNotEmpty), markers);
};

const parseLoop = (lines1, markers) => {
  assert(lines1.length >= 0, "cannot parse an empty block");
  const head = lines1[0];
  if (lines1.length === 1) {
    if (head.length === 0) {
      return "";
    }
    if (!markers.includes(head[0])) {
      return head.replace(/\\./gu, unescape);
    }
  }
  assert(head.length > 0, "first block line must not be empty");
  const marker = head[0];
  assert(markers.includes(marker), "unrecognized marker, got: %o", marker);
  const prefix = `${marker} `;
  const items = [];
  let index1 = 0;
  while (index1 < lines1.length) {
    assert(
      lines1[index1].startsWith(prefix),
      "expected line to start with %o, got: %o",
      lines1[index1],
      prefix,
    );
    const lines2 = [lines1[index1].substring(2)];
    let index2 = index1 + 1;
    while (index2 < lines1.length) {
      if (!lines1[index2].startsWith("  ")) {
        break;
      }
      lines2.push(lines1[index2].substring(2));
      index2 += 1;
    }
    index1 = index2;
    items.push(parseLoop(lines2, markers));
  }
  return [marker, items];
};
