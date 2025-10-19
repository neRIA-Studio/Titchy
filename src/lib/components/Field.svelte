<script lang="ts">
  import type { HTMLLabelAttributes } from "svelte/elements";

  interface Props {
    horizontal?: boolean;
  }

  const {
    horizontal,
    ...rest
  }: Props & HTMLLabelAttributes = $props();
</script>

<label
  {...rest}
  class={["titchy", "field", { horizontal }, rest.class]}
>
  {@render rest.children?.()}
</label>

<style lang="scss">
  @use "@/others/utils.scss" as *;

  :global
  .titchy.field {
    gap: V(spacing-1);

    &.horizontal {
      flex-direction: row;
      align-items: center;
    }
  }
</style>
