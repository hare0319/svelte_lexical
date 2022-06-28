<script lang="ts">
  import LexicalComposer from "$lib/Lexical/LexicalComposer.svelte";
  import ContentEditable from "$lib/Lexical/LexicalContentEditable.svelte";
  import PlainTextPlugin from "$lib/Lexical/LexicalPlainTextPlugin.svelte";
  import theme from "./_theme/ExampleTheme";

  import "$lib/style/styles.css";

  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError: (error: Error) => console.error(error),
  };
</script>

<div class="App">
  <h1>Lexical editor with composer</h1>

  <LexicalComposer {initialConfig}>
    <div class="editor-container">
      <PlainTextPlugin>
        <ContentEditable slot="contentEditable" class="editor-input" />
        <div slot="placeholder" class="editor-placeholder">
          Enter some plain text...
        </div>
      </PlainTextPlugin>
    </div>
  </LexicalComposer>
</div>
