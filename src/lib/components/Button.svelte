<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";

  interface Props {
    variant?: 'primary' | 'secondary' | 'outline' | 'blank';
    rounded?: boolean;
  }

  const {
    variant = 'primary',
    rounded,
    ...rest
  }: Props & HTMLButtonAttributes = $props();
</script>

<button
  {...rest}
  class={["titchy", "button", variant, { rounded }, rest.class]}
>
  {@render rest.children?.()}
</button>

<style lang="scss">
  @use "@/others/utils.scss" as *;

  $accent-color: var(--button-accent-color, C(accent));
  $shadow-color: var(--button-shadow-color, C(primary));
  $highlight-color: var(--button-shadow-color, C(secondary));

  :global
  .titchy.button {
    cursor: pointer;
    padding: 7.5px;

    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 7.5px;

    border-radius: V(radius-1);

    backdrop-filter: blur(8px);
    // filter: drop-shadow(0 0 5px $shadow-color);
    box-shadow: 0 0 5px $shadow-color;

    &:hover:not(:disabled) {
      transform: scale(1.05);
      opacity: 1;
    }

    &:active:not(:disabled) {
      transform: scale(0.95);
      opacity: 0.75;
    }

    &.primary {
      color: $accent-color;
      background-color: set-alpha($accent-color, 20%);
      border: 2px solid set-alpha($highlight-color, 7.5%);

      &:hover:not(:disabled) {
        background-color: set-alpha($accent-color, 30%);
      }
    }

    &.secondary {
      color: $accent-color;
      background-color: set-alpha($highlight-color, 10%);
      border: 2px solid set-alpha($highlight-color, 5%);

      &:hover:not(:disabled) {
        background-color: set-alpha($highlight-color, 15%);
      }
    }

    &.outline {
      color: $accent-color;
      border: 2px solid set-alpha($accent-color, 50%);

      &:hover:not(:disabled) {
        background-color: set-alpha($accent-color, 10%);
      }
    }

    &.blank {
      color: $highlight-color;
      border: 2px solid transparent;

      &:hover:not(:disabled) {
        background-color: set-alpha($highlight-color, 5%);
      }
    }

    &.rounded {
      border-radius: max(100dvw, 100dvh);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.3;
    }
  }
</style>
