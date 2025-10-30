<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  interface Props {
    self?:      HTMLDivElement;
    constrained?: boolean;
  }

  let {
    self = $bindable(),
    constrained,
    ...rest
  }: Props & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
  bind:this={self}
  {...rest}
  class={["titchy", "panel", { constrained }, rest.class]}
>
  {@render rest.children?.()}
</div>

<style lang="scss">
  @use "@/others/utils.scss" as *;

  $max-width:  var(--panel-max-width, min(450px, 80dvw));
  $max-height: var(--panel-max-height, min(450px, 80dvh));

  :global
  .titchy.panel {
    padding: V(spacing-10);
    gap: V(spacing-5);

    background-color: C(primary);
    border: 2px solid C(tertiary);
    border-radius: V(radius-1);

    &.constrained {
      max-width: $max-width;
      max-height: $max-height;
    }
  }
</style>
