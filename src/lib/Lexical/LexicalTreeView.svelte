<script lang="ts">
  import type { EditorState, LexicalEditor } from "lexical";
  import { onMount } from "svelte";
  import { generateContent } from "./LexicalTreeView";

  export let editor: LexicalEditor;
  export let timeTravelButtonClassName: string;
  export let timeTravelPanelButtonClassName: string;
  export let timeTravelPanelClassName: string;
  export let timeTravelPanelSliderClassName: string;
  export let viewClassName: string;

  let timeStampedEditorStates: Array<[number, EditorState]> = [];
  let content: string = "";
  let timeTravelEnabled: boolean = false;
  let playingIndexRef = 0;
  let treeElementRef: HTMLPreElement;
  let isPlaying: boolean = false;

  content = generateContent(editor.getEditorState());
  editor.registerUpdateListener(({ editorState }) => {
    const compositionKey = editor._compositionKey;
    const treeText = generateContent(editor.getEditorState());
    const compositionText =
      compositionKey !== null && `Composition key: ${compositionKey}`;
    content = [treeText, compositionText].filter(Boolean).join("\n\n");

    if (!timeTravelEnabled) {
      timeStampedEditorStates = [
        ...timeStampedEditorStates,
        [Date.now(), editorState],
      ];
    }
  });
  $: totalEditorStates = timeStampedEditorStates.length;
  $: clearTimeout = playTimeTravel(isPlaying);

  function playTimeTravel(arg: unknown) {
    if (isPlaying) {
      let timeoutId: NodeJS.Timeout;
      const play = () => {
        if (playingIndexRef === totalEditorStates - 1 || !isPlaying) {
          isPlaying = false;
          return;
        }

        const currentTime = timeStampedEditorStates[playingIndexRef][0];
        const nextTime = timeStampedEditorStates[playingIndexRef + 1][0];
        const timeDiff = nextTime - currentTime;
        timeoutId = setTimeout(() => {
          if (isPlaying) {
            playingIndexRef++;
            editor.setEditorState(timeStampedEditorStates[playingIndexRef][1]);
            play();
          }
        }, timeDiff);
      };

      play();
    }
  }

  onMount(() => {
    if (treeElementRef !== null) {
      // @ts-ignore Internal field
      treeElementRef.__lexicalEditor = editor;
    }

    return () => {
      // @ts-ignore Internal field
      treeElementRef.__lexicalEditor = null;
    };
  });
</script>

<div class={viewClassName}>
  {#if !timeTravelEnabled && totalEditorStates > 2}
    <button
      on:click={() => {
        const rootElement = editor.getRootElement();

        if (rootElement !== null) {
          rootElement.contentEditable = "false";
          playingIndexRef = totalEditorStates - 1;
          timeTravelEnabled = true;
        }
      }}
      class={timeTravelButtonClassName}
    >
      Time Travel
    </button>
  {/if}
  <pre bind:this={treeElementRef}>{content}</pre>
  {#if timeTravelEnabled}
    <div class={timeTravelPanelClassName}>
      <button
        class={timeTravelPanelButtonClassName}
        on:click={() => {
          isPlaying = !isPlaying;
        }}
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
      <input
        class={timeTravelPanelSliderClassName}
        bind:value={playingIndexRef}
        on:change={() => {
          const timeStampedEditorState =
            timeStampedEditorStates[playingIndexRef];

          if (timeStampedEditorState) {
            editor.setEditorState(timeStampedEditorState[1]);
          }
        }}
        type="range"
        min="1"
        max={totalEditorStates - 1}
      />
      <button
        class={timeTravelPanelButtonClassName}
        on:click={() => {
          const rootElement = editor.getRootElement();

          if (rootElement !== null) {
            rootElement.contentEditable = "true";
            playingIndexRef = timeStampedEditorStates.length - 1;
            const timeStampedEditorState =
              timeStampedEditorStates[playingIndexRef];
            editor.setEditorState(timeStampedEditorState[1]);

            timeTravelEnabled = false;
            isPlaying = false;
          }
        }}
      >
        Exit
      </button>
    </div>
  {/if}
</div>
