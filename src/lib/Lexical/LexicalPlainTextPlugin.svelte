<script lang="ts" Context="Module">
  import { getLexicalComposerContext } from "$lib/Lexical/LexicalComposerContext";
  import { registerPlainText } from "@lexical/plain-text";
  import { getCanShowPlaceholder } from "$lib/shared/useCanShowPlaceholder";
  import { getDecorators } from "$lib/shared/useDecorators";
  import { onMount } from "svelte";

  const [editor] = getLexicalComposerContext();

  let showPlaceholder: boolean = getCanShowPlaceholder(editor, (stat) => {
    showPlaceholder = stat;
  });

  // Decorator not fully supported, as limited resource available
  // and not required for now.
  let decorators = getDecorators(editor, (decs) => {
    decorators = decs;
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
