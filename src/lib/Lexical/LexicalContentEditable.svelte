<svelte:options />

<script lang="ts">
  import { onMount } from "svelte";
  import { getLexicalComposerContext } from "$lib/Lexical/LexicalComposerContext";
  import type { Maybe } from "$lib/shared/types";

  export let ariaActiveDescendantID: Maybe<string> = undefined;
  export let ariaAutoComplete: Maybe<"inline" | "list" | "both" | "none"> =
    undefined;
  export let ariaControls: Maybe<string> = undefined;
  export let ariaDescribedBy: Maybe<string> = undefined;
  export let ariaExpanded: Maybe<boolean> = undefined;
  export let ariaLabel: Maybe<string> = undefined;
  export let ariaLabelledBy: Maybe<string> = undefined;
  export let ariaMultiline: Maybe<boolean> = undefined;
  export let ariaOwneeID: Maybe<string> = undefined;
  export let ariaRequired: Maybe<boolean | "true" | "false"> = undefined;
  export let autoCapitalize: Maybe<boolean> = undefined;
  export let autoComplete: Maybe<string> = undefined;
  export let autoCorrect: Maybe<boolean> = undefined;
  let className: Maybe<string> = undefined;
  export { className as class };
  export let id: Maybe<string> = undefined;
  export let role: Maybe<string> = undefined;
  export let spellCheck: Maybe<boolean> = undefined;
  export let style: Maybe<string> = undefined;
  export let tabIndex: Maybe<number> = undefined;
  export let testid: Maybe<string> = undefined;

  const [editor] = getLexicalComposerContext();
  let isReadOnly = editor.isReadOnly();
  editor.registerReadOnlyListener((currentIsReadOnly) => {
    isReadOnly = currentIsReadOnly;
  });
  let editorElm: HTMLElement;

  onMount(() => {
    editor.setRootElement(editorElm);
  });
</script>

<div
  bind:this={editorElm}
  aria-activedescendant={isReadOnly ? null : ariaActiveDescendantID}
  aria-autocomplete={isReadOnly ? null : ariaAutoComplete}
  aria-controls={isReadOnly ? null : ariaControls}
  aria-describedby={ariaDescribedBy}
  aria-expanded={isReadOnly
    ? null
    : role === "combobox"
    ? !!ariaExpanded
    : null}
  aria-label={ariaLabel}
  aria-labelledby={ariaLabelledBy}
  aria-multiline={ariaMultiline}
  aria-owns={isReadOnly ? null : ariaOwneeID}
  aria-required={ariaRequired}
  autocapitalize={autoCapitalize !== undefined
    ? String(autoCapitalize)
    : undefined}
  autocomplete={autoComplete}
  autocorrect={autoCorrect !== undefined ? String(autoCorrect) : undefined}
  class={className}
  contenteditable={!isReadOnly}
  data-testid={testid}
  {id}
  role={isReadOnly ? undefined : role}
  spellcheck={spellCheck}
  {style}
  {tabIndex}
/>
