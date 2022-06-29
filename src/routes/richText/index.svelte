<script lang="ts">
  import type { InitialConfigType } from "$lib/Lexical/LexicalComposer";

  import { HeadingNode, QuoteNode } from "@lexical/rich-text";
  import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
  import { ListItemNode, ListNode } from "@lexical/list";
  import { CodeHighlightNode, CodeNode } from "@lexical/code";
  import { AutoLinkNode, LinkNode } from "@lexical/link";
  import { TRANSFORMERS } from "@lexical/markdown";

  import LexicalComposer from "$lib/Lexical/LexicalComposer.svelte";
  import RichTextPlugin from "$lib/Lexical/LexicalRichTextPlugin.svelte";
  import ContentEditable from "$lib/Lexical/LexicalContentEditable.svelte";
  import HistoryPlugin from "$lib/Lexical/LexicalHistoryPlugin";

  import ExampleTheme from "./_styles/ExampleTheme";
  import "./_styles/style.css";

  const editorConfig: InitialConfigType = {
    namespace: "MyRichEditor",
    theme: ExampleTheme,
    onError: (error: Error) => {
      throw error;
    },
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
    ],
  };
</script>

<div class="App">
  <h1>Lexical Rich Text Editor with Composer</h1>

  <LexicalComposer initialConfig={editorConfig}>
    <div class="editor-container">
      <div class="editor-inner">
        <RichTextPlugin>
          <ContentEditable slot="contentEditable" class="editor-input" />
          <div class="editor-placeholder" slot="placeholder">
            Enter some rich text...
          </div>
        </RichTextPlugin>
        {HistoryPlugin({})}
      </div>
    </div>
  </LexicalComposer>
</div>
