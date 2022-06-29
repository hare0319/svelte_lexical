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

<div class="App">
  <div class="editor-container">
    <div contenteditable="true" bind:this={editor} class="editor-input" />
  </div>

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
</div>

<style>
  .App {
    font-family: sans-serif;
    text-align: center;
  }

  .editor-container {
    background: #fff;
    margin: 20px auto 20px auto;
    border-radius: 2px;
    max-width: 600px;
    color: #000;
    position: relative;
    line-height: 20px;
    font-weight: 400;
    text-align: left;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }

  .editor-input {
    min-height: 150px;
    resize: none;
    font-size: 15px;
    caret-color: #050505;
    position: relative;
    tab-size: 1;
    outline: 0;
    padding: 15px 10px;
  }

  div :global(.editor-paragraph) {
    margin: 0 0 15px 0;
    position: relative;
    color: peru;
  }
</style>
