import type { LexicalEditor } from "lexical";

export function getDecorators(
  editor: LexicalEditor,
  updateDecos: (nextDecorators: Record<string, unknown>) => void
) {
  const decorators = editor.getDecorators();

  editor.registerDecoratorListener(updateDecos);

  return decorators;
}
