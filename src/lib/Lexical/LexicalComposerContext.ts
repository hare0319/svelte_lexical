import type { LexicalEditor, EditorThemeClasses } from "lexical";
import { hasContext, getContext, setContext } from "svelte";

export type LexicalComposerContextType = {
  getTheme: () => EditorThemeClasses | null | undefined;
};

export type LexicalComposerContextWithEditor = [
  LexicalEditor,
  LexicalComposerContextType
];

const COMPOSER_CONTEXT_KEY = Symbol();

// export const LexicalComposerContext = writable<
//   LexicalComposerContextWithEditor | null | undefined
// >(null);

export function createLexicalComposerContext(
  parent: LexicalComposerContextWithEditor | null | undefined,
  theme: EditorThemeClasses | null | undefined
): LexicalComposerContextType {
  let parentContext: LexicalComposerContextType | null = null;

  if (parent != null) {
    parentContext = parent[1];
  }

  function getTheme() {
    if (theme != null) {
      return theme;
    }

    return parentContext != null ? parentContext.getTheme() : null;
  }

  return {
    getTheme,
  };
}

export function getLexicalComposerContext(): LexicalComposerContextWithEditor {
  if (hasContext(COMPOSER_CONTEXT_KEY)) {
    return getContext(COMPOSER_CONTEXT_KEY);
  } else {
    throw new Error("LexicalComposerContext has not registered!");
  }
}

export function setLexicalComposerContext(
  composerContext: LexicalComposerContextWithEditor
) {
  setContext(COMPOSER_CONTEXT_KEY, composerContext);
}
