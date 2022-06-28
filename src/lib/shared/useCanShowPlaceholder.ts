import type { LexicalEditor } from "lexical";
import { $canShowPlaceholderCurry as _canShowPlaceholderCurry } from "@lexical/text";
import { mergeRegister } from "@lexical/utils";

export function canShowPlaceholderFromCurrentEditorState(
  editor: LexicalEditor
): boolean {
  return editor
    .getEditorState()
    .read(_canShowPlaceholderCurry(editor.isComposing()));
}

export function getCanShowPlaceholder(
  editor: LexicalEditor,
  updateCanShowPlaceholder: (stat: boolean) => void
): boolean {
  const canShowPLaceholder = canShowPlaceholderFromCurrentEditorState(editor);

  mergeRegister(
    editor.registerUpdateListener(() => {
      updateCanShowPlaceholder(
        canShowPlaceholderFromCurrentEditorState(editor)
      );
    }),
    editor.registerReadOnlyListener(() => {
      updateCanShowPlaceholder(
        canShowPlaceholderFromCurrentEditorState(editor)
      );
    })
  );

  return canShowPLaceholder;
}
