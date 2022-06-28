import { createEditor } from "lexical";
import { registerPlainText } from "@lexical/plain-text";

export const lex = createEditor({
  namespace: "LexicalEditor",
  theme: {
    placeholder: "editor-placeholder",
    paragraph: "editor-paragraph",
  },
  onError: console.error,
});

registerPlainText(lex);
