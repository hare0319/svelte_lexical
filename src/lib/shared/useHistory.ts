import type { HistoryState } from "@lexical/history";
import type { LexicalEditor } from "lexical";
import { createEmptyHistoryState, registerHistory } from "@lexical/history";

export function useHistory(
  editor: LexicalEditor,
  externalHistoryState?: HistoryState,
  delay = 1000
) {
  const historyState: HistoryState =
    externalHistoryState || createEmptyHistoryState();
  registerHistory(editor, historyState, delay);
}
