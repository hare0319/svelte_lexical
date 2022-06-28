<script lang="ts" Context="Module">
  import { getLexicalComposerContext } from "$lib/Lexical/LexicalComposerContext";
  import { registerPlainText } from "@lexical/plain-text";
  import { getCanShowPlaceholder } from "$lib/shared/useCanShowPlaceholder";
  import { onMount } from "svelte";
  import { mergeRegister } from "@lexical/utils";

  const [editor] = getLexicalComposerContext();

  let showPlaceholder: boolean = getCanShowPlaceholder(editor, (stat) => {
    showPlaceholder = stat;
  });

  onMount(() => {
    registerPlainText(editor);
  });

  // export let contentEditable: HTMLElement;
  // export let placeholder: HTMLElement | string;
</script>

<slot name="contentEditable" />
{#if showPlaceholder}
  <slot name="placeholder" />
{/if}

{showPlaceholder}
