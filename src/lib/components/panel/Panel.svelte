<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  interface Props {
    self?:        HTMLDivElement;
    variant?:     'primary' | 'secondary' | 'wrapper';
    centered?:    boolean;
    borderless?:  boolean;
    constrained?: boolean;
  }

  let {
    self    = $bindable(),
    variant = 'primary',
    centered,
    borderless,
    constrained,
    ...rest
  }: Props & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
  bind:this={self}
  {...rest}
  class={["titchy", "panel", variant, { centered, borderless, constrained }, rest.class]}
>
  {@render rest.children?.()}
</div>

<style lang="scss">
  @use "$lib/styles/utils.scss" as *;

  $accent-color:    var(--panel-accent-color, C(accent));
  $shadow-color:    var(--panel-shadow-color, C(primary));
  $highlight-color: var(--panel-highlight-color, C(secondary));

  $max-width:    var(--panel-max-width, min(450px, 80dvw));
  $max-height:   var(--panel-max-height, min(450px, 80dvh));

  :global
  .titchy.panel {
    padding: V(spacing-6);
    gap: V(spacing-5);
    border: 2px solid transparent;
    border-radius: V(radius-1);

    &.primary {
      background-color: set-alpha($shadow-color);
      border-color: set-alpha($highlight-color, 10%);
    }

    &.secondary {
      background-color: set-alpha($accent-color, 10%);
      border-color: set-alpha($accent-color, 35%);
    }

    &.constrained {
      max-width: $max-width;
      max-height: $max-height;
    }

    &.borderless {
      border-width: 0;
    }

    &.centered {
      align-items: center;
      justify-content: center;
    }
  }
</style>
