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
  class={["titchy", "panel", rest.class]}
>
  {@render rest.children?.()}
</div>

<style lang="scss">
  @use "@/others/utils.scss" as *;

  $accent-color: var(--panel-accent-color, C(accent));

  :global
  .titchy.panel {
    max-width: min(450px, 80dvw);
    padding: V(spacing-5);
    gap: V(spacing-5);

    background-color: C(primary);
    border: 2px solid C(tertiary);
    border-radius: V(radius-1);
  }
</style>
