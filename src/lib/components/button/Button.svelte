<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";

  interface Props {
    self?:    HTMLButtonElement;
    variant?: 'primary' | 'secondary' | 'outline' | 'blank' | 'wrapper';
    rounded?: boolean;
  }

  let {
    self = $bindable(),
    variant = 'primary',
    rounded,
    ...rest
  }: Props & HTMLButtonAttributes = $props();
</script>

<button
  bind:this={self}
  {...rest}
  class={["titchy", "button", variant, { rounded }, rest.class]}
>
  {@render rest.children?.()}
</button>

<style lang="scss">
  @use "@/others/utils.scss" as *;

  $accent-color: var(--button-accent-color, C(accent));
  $shadow-color: var(--button-shadow-color, C(primary));
  $highlight-color: var(--button-highlight-color, C(secondary));

  :global
  .titchy.button {
    cursor: pointer;
    padding: V(spacing-2);
    font-size: V(text-s);

    min-height: 36px;
    min-width: 36px;

    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: V(spacing-2);

    border-radius: V(radius-1);

    backdrop-filter: blur(8px);
    box-shadow: 0 0 5px set-alpha($shadow-color, 50%);

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

    &.wrapper {
      @include flex(true);
      @include default();
      cursor: pointer;
    }

    &.rounded {
      border-radius: max(100dvw, 100dvh);
    }

    &:hover:not(:disabled) {
      transform: scale(1.05);
      opacity: 1;
    }

    &:active:not(:disabled) {
      transform: scale(0.95);
      opacity: 0.75;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.35;
    }
  }
</style>
