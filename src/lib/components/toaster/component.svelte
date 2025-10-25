<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { blur } from "svelte/transition";

  interface Props {
    self?: HTMLElement;
  }

  let {
    self = $bindable(),
    ...rest
  }: Props & HTMLAttributes<HTMLElement> = $props();
</script>

<section
  bind:this={self}
  {...rest}
  class={["titchy", "toaster", rest.class]}
  in:blur
></section>

<style lang="scss">
  @use "@/others/utils.scss" as *;

  $padding: var(--toaster-padding, V(spacing-11));
  $gap: var(--toaster-gap, V(spacing-4));
  $z-index: var(--toaster-z-index, 100);

  :global
  .titchy.toaster {
    @include fill-fixed();

    pointer-events: none;
    padding: $padding;
    z-index: $z-index;

    flex-direction: column-reverse;
    align-items: center;
    justify-content: start;
    gap: $gap;
  }
</style>
