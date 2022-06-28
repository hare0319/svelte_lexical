import type {
  EditorState,
  LexicalEditor,
  LexicalNode,
  EditorThemeClasses,
} from "lexical";

import { $getRoot as _getRoot, createEditor } from "lexical";

import type { Klass } from "$lib/shared/types";
import {
  createLexicalComposerContext,
  type LexicalComposerContextType,
  type LexicalComposerContextWithEditor,
} from "./LexicalComposerContext";

const HISTORY_MERGE_OPTIONS = { tag: "history-merge" };

export type InitialEditorStateType =
  | null
  | string
  | EditorState
  | ((editor: LexicalEditor) => void);

export type InitialConfigType = Readonly<{
  namespace: string;
  nodes?: ReadonlyArray<Klass<LexicalNode>>;
  onError: (error: Error, editor: LexicalEditor) => void;
  readonly?: boolean;
  theme?: EditorThemeClasses;
  editorState?: InitialEditorStateType;
}>;

export function LexicalComposer({
  namespace,
  nodes,
  onError,
  readonly,
  theme,
  editorState: initialEditorState,
}: InitialConfigType): LexicalComposerContextWithEditor {
  const context: LexicalComposerContextType = createLexicalComposerContext(
    null,
    theme
  );

  const editor = createEditor({
    namespace,
    nodes,
    onError: (error) => onError(error, editor),
    readOnly: true,
    theme,
  });
  initialiseEditor(editor, initialEditorState);

  editor.setReadOnly(readonly || false);

  return [editor, context];
}

function initialiseEditor(
  editor: LexicalEditor,
  initialEditorState?: InitialEditorStateType
): void {
  if (initialEditorState === null) {
    return;
  } else if (initialEditorState === undefined) {
    // TODO Uncomment in 0.4
  } else if (initialEditorState !== null) {
    switch (typeof initialEditorState) {
      case "string": {
        const parsedEditorState = editor.parseEditorState(initialEditorState);
        editor.setEditorState(parsedEditorState, HISTORY_MERGE_OPTIONS);
        break;
      }
      case "object": {
        editor.setEditorState(initialEditorState, HISTORY_MERGE_OPTIONS);
        break;
      }
      case "function": {
        editor.update(() => {
          const root = _getRoot();
          if (root.isEmpty()) {
            initialEditorState(editor);
          }
        }, HISTORY_MERGE_OPTIONS);
        break;
      }
    }
  }
}
