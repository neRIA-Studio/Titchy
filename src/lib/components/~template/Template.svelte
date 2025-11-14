<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  interface Props {
    self?: HTMLDivElement;
  }

  let {
    self = $bindable(),
    ...rest
  }: Props & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
  bind:this={self}
  {...rest}
  class={["titchy", "template", rest.class]}
>
  Hello
</div>

<style lang="scss">
  @use "$lib/styles/utils.scss" as *;

  $accent-color: var(--template-accent-color, C(accent));

  :global
  .titchy.template {
    color: $accent-color;
    font-style: italic;
    opacity: 0.5;
  }
</style>
