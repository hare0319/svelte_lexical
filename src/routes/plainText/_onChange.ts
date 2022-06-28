import {
  $getRoot as _getRoot,
  $getSelection as _getSelection,
  type EditorState,
} from "lexical";

export function onChange(editorState: EditorState) {
  editorState.read(() => {
    const root = _getRoot();
    const sel = _getSelection();

    console.log(root, sel);
  });
}
