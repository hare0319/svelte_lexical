<script lang="ts">
  import { setLexicalComposerContext } from "./LexicalComposerContext";
  import { type InitialConfigType, LexicalComposer } from "./LexicalComposer";

  export let initialConfig: InitialConfigType;
  const composeContext = LexicalComposer(initialConfig);
  setLexicalComposerContext(composeContext);
</script>

<slot />
