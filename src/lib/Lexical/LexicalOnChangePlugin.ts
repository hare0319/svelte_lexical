import type { EditorState, LexicalEditor } from "lexical";
import { getLexicalComposerContext } from "$lib/Lexical/LexicalComposerContext";

export default function OnChangePlugin({
  ignoreInitialChange = true,
  ignoreSelectionChange = false,
  onChange,
}: {
  ignoreInitialChange?: boolean;
  ignoreSelectionChange?: boolean;
  onChange: (editorState: EditorState, editor: LexicalEditor) => void;
}) {
  const [editor] = getLexicalComposerContext();

  editor.registerUpdateListener(
    ({ editorState, dirtyElements, dirtyLeaves, prevEditorState }) => {
      if (
        ignoreSelectionChange &&
        dirtyElements.size === 0 &&
        dirtyLeaves.size === 0
      )
        return;

      if (ignoreInitialChange && prevEditorState.isEmpty()) return;

      onChange(editorState, editor);
    }
  );
  return "";
}
