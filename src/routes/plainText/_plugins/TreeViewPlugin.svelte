<script lang="ts">
  import { getLexicalComposerContext } from "$lib/Lexical/LexicalComposerContext";
  import TreeView from "$lib/Lexical/LexicalTreeView.svelte";

  const [editor] = getLexicalComposerContext();
  const props = {
    viewClassName: "tree-view-output",
    timeTravelPanelClassName: "debug-timetravel-panel",
    timeTravelButtonClassName: "debug-timetravel-button",
    timeTravelPanelSliderClassName: "debug-timetravel-panel-slider",
    timeTravelPanelButtonClassName: "debug-timetravel-panel-button",
    editor,
  };
</script>

<TreeView {...props} />
