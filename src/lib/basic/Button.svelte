<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";

  interface Props {
    variant?: 'primary' | 'secondary';
  }

  let { variant = 'primary', ...rest }:Props & HTMLButtonAttributes = $props();
</script>

<button
  {...rest}
  class={["titchy", "button", variant, rest.class]}
>
  {@render rest.children?.()}
</button>

<style lang="scss">
  @use "@/others/utils.scss" as *;

  $accent-color: var(--button-accent-color, C(accent));
  $text-color: var(--button-text-color, C(primary));

  :global
  .titchy.button {
    cursor: pointer;
    padding: 4px;

    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 7.5px;

    color: $text-color;
    background-color: $accent-color;
    border-radius: V(radius-1);

    &:hover:not(:disabled) {
      transform: scale(1.05);
      opacity: 1;
    }

    &:active:not(:disabled) {
      transform: scale(0.95);
      opacity: 0.8;
    }

    &.primary {
      padding: 6px;
    }

    &.secondary {
      color: $accent-color;
      background-color: $text-color;

      border: 2px solid $accent-color;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.2;
      filter: saturate(0.66);
    }
  }
</style>
