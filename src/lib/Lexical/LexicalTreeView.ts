import type {
  ElementNode,
  EditorState,
  LexicalNode,
  RangeSelection,
  GridSelection,
  NodeSelection,
} from "lexical";

import {
  $getRoot as _getRoot,
  $getSelection as _getSelection,
  $isElementNode as _isElementNode,
  $isGridSelection as _isGridSelection,
  $isRangeSelection as _isRangeSelection,
  $isTextNode as _isTextNode,
} from "lexical";

import { $isMarkNode as _isMarkNode } from "@lexical/mark";

const NON_SINGLE_WIDTH_CHARS_REPLACEMENT: Readonly<Record<string, string>> =
  Object.freeze({
    "\t": "\\t",
    "\n": "\\n",
  });
const NON_SINGLE_WIDTH_CHARS_REGEX = new RegExp(
  Object.keys(NON_SINGLE_WIDTH_CHARS_REPLACEMENT).join("|"),
  "g"
);
const SYMBOLS: Record<string, string> = Object.freeze({
  ancestorHasNextSibling: "|",
  ancestorIsLastChild: " ",
  hasNextSibling: "├",
  isLastChild: "└",
  selectedChar: "^",
  selectedLine: ">",
});

export function generateContent(editorState: EditorState): string {
  let res = " root\n";

  const selectionString = editorState.read(() => {
    const selection = _getSelection();

    visitTree(_getRoot(), (node: LexicalNode, indent: Array<string>) => {
      const nodeKey = node.getKey();
      const nodeKeyDisplay = `(${nodeKey})`;
      const typeDisplay = node.getType() || "";
      const isSelected = node.isSelected();
      const idsDisplay = _isMarkNode(node)
        ? ` id: [ ${node.getIDs().join(", ")}]`
        : "";

      res += `${isSelected ? SYMBOLS.selectedLine : " "} ${indent.join(
        " "
      )} ${nodeKeyDisplay} ${typeDisplay} ${idsDisplay} ${printNode(node)}\n`;

      res += printSelectedCharLine({
        indent,
        isSelected,
        node,
        nodeKeyDisplay,
        selection,
        typeDisplay,
      });
    });
    return selection === null
      ? ": null"
      : _isRangeSelection(selection)
      ? printRangeSelection(selection)
      : _isGridSelection(selection)
      ? printGridSelection(selection)
      : printObjectSelection(selection);
  });
  return res + "\n selection" + selectionString;
}

function visitTree(
  currentNode: ElementNode,
  visitor: (node: LexicalNode, indentArr: Array<string>) => void,
  indent: Array<string> = []
) {
  const childNodes = currentNode.getChildren();
  const childNodesLength = childNodes.length;

  childNodes.forEach((childNode, i) => {
    visitor(
      childNode,
      indent.concat(
        i === childNodesLength - 1
          ? SYMBOLS.isLastChild
          : SYMBOLS.hasNextSibling
      )
    );

    if (_isElementNode(childNode)) {
      visitTree(
        childNode,
        visitor,
        indent.concat(
          i === childNodesLength - 1
            ? SYMBOLS.ancestorIsLastChild
            : SYMBOLS.ancestorHasNextSibling
        )
      );
    }
  });
}

function normalize(text: string) {
  return Object.entries(NON_SINGLE_WIDTH_CHARS_REPLACEMENT).reduce(
    (acc, [key, value]) => acc.replace(new RegExp(key, "g"), String(value)),
    text
  );
}

function printNode(node: LexicalNode) {
  if (_isTextNode(node)) {
    const text = node.getTextContent(true);
    const title = text.length === 0 ? "(empty)" : `"${normalize(text)}"`;
    const properties = printAllProperties(node);
    return [title, properties.length !== 0 ? `{ ${properties} }` : null]
      .filter(Boolean)
      .join(" ")
      .trim();
  }
  return "";
}

function printAllProperties(node: LexicalNode) {
  return [
    printFormatProperties(node),
    printDetailProperties(node),
    printModeProperties(node),
  ]
    .filter(Boolean)
    .join(", ");
}

const FORMAT_PREDICATES = [
  (node: LexicalNode | RangeSelection) => node.hasFormat("bold") && "Bold",
  (node: LexicalNode | RangeSelection) => node.hasFormat("code") && "Code",
  (node: LexicalNode | RangeSelection) => node.hasFormat("italic") && "Italic",
  (node: LexicalNode | RangeSelection) =>
    node.hasFormat("strikethrough") && "Strikethrough",
  (node: LexicalNode | RangeSelection) =>
    node.hasFormat("subscript") && "Subscript",
  (node: LexicalNode | RangeSelection) =>
    node.hasFormat("superscript") && "Superscript",
  (node: LexicalNode | RangeSelection) =>
    node.hasFormat("underline") && "Underline",
];

const DETAIL_PREDICATES = [
  (node: LexicalNode) => node.isDirectionless() && "Directionless",
  (node: LexicalNode) => node.isUnmergeable() && "Unmergeable",
];

const MODE_PREDICATES = [
  (node: LexicalNode) => node.isToken() && "Token",
  (node: LexicalNode) => node.isSegmented() && "Segmented",
  (node: LexicalNode) => node.isInert() && "Inert",
];

function printDetailProperties(nodeOrSelection: LexicalNode) {
  let str = DETAIL_PREDICATES.map((predicate) => predicate(nodeOrSelection))
    .filter(Boolean)
    .join(", ")
    .toLocaleLowerCase();

  if (str !== "") {
    str = "detail: " + str;
  }

  return str;
}

function printModeProperties(nodeOrSelection: LexicalNode) {
  let str = MODE_PREDICATES.map((predicate) => predicate(nodeOrSelection))
    .filter(Boolean)
    .join(", ")
    .toLocaleLowerCase();

  if (str !== "") {
    str = "mode: " + str;
  }

  return str;
}

function printFormatProperties(nodeOrSelection: LexicalNode | RangeSelection) {
  let str = FORMAT_PREDICATES.map((predicate) => predicate(nodeOrSelection))
    .filter(Boolean)
    .join(", ")
    .toLocaleLowerCase();

  if (str !== "") {
    str = "format: " + str;
  }

  return str;
}

function printSelectedCharLine({
  indent,
  isSelected,
  node,
  nodeKeyDisplay,
  selection,
  typeDisplay,
}: {
  indent: Array<string>;
  isSelected: boolean;
  node: LexicalNode;
  nodeKeyDisplay: string;
  selection: GridSelection | NodeSelection | RangeSelection | null;
  typeDisplay: string;
}) {
  // No selection or node is not selected
  if (
    !_isTextNode(node) ||
    !_isRangeSelection(selection) ||
    !isSelected ||
    _isElementNode(node)
  ) {
    return "";
  }

  // No selected characters.
  const anchor = selection.anchor;
  const focus = selection.focus;

  if (
    node.getTextContent() === "" ||
    (anchor.getNode() === focus.getNode() && anchor.offset === focus.offset)
  ) {
    return "";
  }

  const [start, end] = _getSelectionStartEnd(node, selection);

  if (start === end) {
    return "";
  }

  const selectionLastIndent =
    indent[indent.length - 1] === SYMBOLS.hasNextSibling
      ? SYMBOLS.ancestorHasNextSibling
      : SYMBOLS.ancestorIsLastChild;

  const indentionChars = [
    ...indent.slice(0, indent.length - 1),
    selectionLastIndent,
  ];
  const unselectedChars = Array(start + 1).fill(" ");
  const selectedChars = Array(end - start).fill(SYMBOLS.selectedChar);
  const paddingLength = typeDisplay.length + 3;

  const nodePrintSpaces = Array(nodeKeyDisplay.length + paddingLength).fill(
    " "
  );

  return (
    [
      SYMBOLS.selectedLine,
      indentionChars.join(" "),
      [...nodePrintSpaces, ...unselectedChars, ...selectedChars].join(""),
    ].join(" ") + "\n"
  );
}

function _getSelectionStartEnd(
  node: LexicalNode,
  selection: RangeSelection | GridSelection
): [number, number] {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const textContent = node.getTextContent(true);
  const textLength = textContent.length;

  let start = -1;
  let end = -1;

  //Only one node is being selected.
  if (anchor.type === "text" && focus.type === "text") {
    const anchorNode = anchor.getNode();
    const focusNode = focus.getNode();

    if (
      anchorNode === focusNode &&
      node === anchorNode &&
      anchor.offset !== focus.offset
    ) {
      [start, end] =
        anchor.offset < focus.offset
          ? [anchor.offset, focus.offset]
          : [focus.offset, anchor.offset];
    } else if (node === anchorNode) {
      [start, end] = anchorNode.isBefore(focusNode)
        ? [anchor.offset, textLength]
        : [0, anchor.offset];
    } else if (node === focusNode) {
      [start, end] = focusNode.isBefore(anchorNode)
        ? [focus.offset, textLength]
        : [0, focus.offset];
    } else {
      [start, end] = [0, textLength];
    }
  }

  // Account for non-single width characters.
  const numNonSingleWidthCharBeforeSelection = (
    textContent.slice(0, start).match(NON_SINGLE_WIDTH_CHARS_REGEX) || []
  ).length;
  const numNonSingleWidthCharInSelection = (
    textContent.slice(start, end).match(NON_SINGLE_WIDTH_CHARS_REGEX) || []
  ).length;

  return [
    start + numNonSingleWidthCharBeforeSelection,
    end +
      numNonSingleWidthCharBeforeSelection +
      numNonSingleWidthCharInSelection,
  ];
}

function printRangeSelection(selection: RangeSelection): string {
  let res = "";

  const formatText = printFormatProperties(selection);
  res += `: range ${formatText !== "" ? `{ ${formatText} }` : ""}`;

  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorOffset = anchor.offset;
  const focusOffset = focus.offset;

  res += `\n  ├ anchor { key: ${anchor.key}, offset: ${
    anchorOffset === null ? "null" : anchorOffset
  }, type: ${anchor.type} }`;
  res += `\n  └ focus { key: ${focus.key}, offset: ${
    focusOffset === null ? "null" : focusOffset
  }, type: ${focus.type} }`;

  return res;
}

function printObjectSelection(selection: NodeSelection): string {
  return `: node\n  └ [${Array.from(selection._nodes).join(", ")}]`;
}

function printGridSelection(selection: GridSelection): string {
  return `: grid\n  └ { grid: ${selection.gridKey}, anchorCell: ${selection.anchor.key}, focusCell: ${selection.focus.key} }`;
}
