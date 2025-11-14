<script lang="ts">
  import type { HTMLLabelAttributes } from "svelte/elements";

  interface Props {
    self?:       HTMLLabelElement;
    horizontal?: boolean;
  }

  let {
    self = $bindable(),
    horizontal,
    ...rest
  }: Props & HTMLLabelAttributes = $props();
</script>

<label
  bind:this={self}
  {...rest}
  class={["titchy", "label", { horizontal }, rest.class]}
>
  {@render rest.children?.()}
</label>

<style lang="scss">
  @use "$lib/styles/utils.scss" as *;

  :global
  .titchy.label {
    gap: V(spacing-4);
    font-size: V(text-s);
    > * { font-size: V(text-m); }

    &.horizontal {
      flex-direction: row;
      align-items: center;
    }
  }
</style>
