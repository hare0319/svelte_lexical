import type { HistoryState } from "@lexical/history";
import { getLexicalComposerContext } from "./LexicalComposerContext";
import { useHistory } from "$lib/shared/useHistory";

export type { HistoryState };

export default function HistoryPlugin({
  externalHistoryState,
}: {
  externalHistoryState?: HistoryState;
}) {
  const [editor] = getLexicalComposerContext();
  useHistory(editor, externalHistoryState);
  return "";
}
