<script lang="ts">
  import LexicalComposer from "$lib/Lexical/LexicalComposer.svelte";
  import ContentEditable from "$lib/Lexical/LexicalContentEditable.svelte";
  import PlainTextPlugin from "$lib/Lexical/LexicalPlainTextPlugin.svelte";
  import OnChangePlugin from "$lib/Lexical/LexicalOnChangePlugin";
  import HistoryPlugin from "$lib/Lexical/LexicalHistoryPlugin";

  import TreeViewPlugin from "$lib/components/TreeViewPlugin.svelte";
  import theme from "./_styles/ExampleTheme";
  import { onChange } from "./_onChange";

  import "./_styles/styles.css";

  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError: (error: Error) => console.error(error),
  };
</script>

<div class="App">
  <h1>Lexical Plain Text Editor with Composer</h1>

  <LexicalComposer {initialConfig}>
    <div class="editor-container">
      <PlainTextPlugin>
        <ContentEditable slot="contentEditable" class="editor-input" />
        <div slot="placeholder" class="editor-placeholder">
          Enter some plain text...
        </div>
      </PlainTextPlugin>
      <!-- <OnChangePlugin {onChange} /> -->
      <!-- {OnChangePlugin({ onChange })} -->
      {HistoryPlugin({})}
      <TreeViewPlugin />
    </div>
  </LexicalComposer>
</div>
