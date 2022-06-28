<script lang="ts">
  import LexicalComposer from "$lib/Lexical/LexicalComposer.svelte";
  import ContentEditable from "$lib/Lexical/LexicalContentEditable.svelte";
  import PlainTextPlugin from "$lib/Lexical/LexicalPlainTextPlugin.svelte";

  const initialConfig = {
    namespace: "MyEditor",
    theme: {},
    onError: (error: Error) => console.error(error),
  };
</script>

<h1>Lexical editor with composer</h1>

<LexicalComposer {initialConfig}>
  <div class="editor-container">
    <PlainTextPlugin>
      <ContentEditable slot="contentEditable" />
      <div slot="placeholder" class="editor-placeholder">
        Enter some plain text...
      </div>
    </PlainTextPlugin>
  </div>
</LexicalComposer>
