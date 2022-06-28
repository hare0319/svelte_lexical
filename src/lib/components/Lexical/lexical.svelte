<script lang="ts">
  import {
    $getRoot as _getRoot,
    $getSelection as _getSelection,
    $createParagraphNode as _createParagraphNode,
    $createTextNode as _createTextNode,
  } from "lexical";
  import { onMount } from "svelte";
  import { lex } from "./lexical";

  let editor: HTMLElement;
  let lexCtx: string;

  lex.registerUpdateListener(({ editorState }) => {
    lexCtx = JSON.stringify(editorState.toJSON());
  });

  onMount(() => {
    lex.setRootElement(editor);
  });
</script>

<div contenteditable="true" bind:this={editor} />

<button
  on:click={() => {
    lex.update(() => {
      const root = _getRoot();
      const selection = _getSelection();
      const paragraphNode = _createParagraphNode();
      const textNode = _createTextNode("Hello");
      paragraphNode.append(textNode);
      root.append(paragraphNode);
    });
  }}>Init</button
>
<div>
  <p>{lexCtx}</p>
</div>

<style>
  :global(.editor-placeholder) {
    color: #999;
    overflow: hidden;
    position: absolute;
    top: 15px;
    left: 15px;
    user-select: none;
    pointer-events: none;
  }

  :global(.editor-paragraph) {
    margin: 0 0 15px 0;
    position: relative;
    color: peru;
  }
</style>
