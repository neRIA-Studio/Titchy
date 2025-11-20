<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  interface Props {
    self?:        HTMLElement;
    'safe-area'?: 'padding' | 'margin' | 'size';
    fill?:        'height' | 'width' | 'both';
    expandable?:  boolean;
  }

  let {
    self                  = $bindable(),
    'safe-area': safeArea = 'padding',
    fill                  = 'height',
    expandable            = false,
    ...rest
  }: Props & HTMLAttributes<HTMLElement> = $props();
</script>

<main
  bind:this={self}
  {...rest}
  class={["titchy", "screen", safeArea, fill, { expandable }, rest.class]}
>
  {@render rest.children?.()}
</main>

<style lang="scss">
  @use "$lib/styles/utils.scss" as *;

  $inset-top: env(safe-area-inset-top);
  $inset-left: env(safe-area-inset-left);
  $inset-bottom: env(safe-area-inset-bottom);
  $inset-right: env(safe-area-inset-right);

  :global
  .titchy.screen {
    overflow: hidden;

    &:is(.height, .both) {
      @include height(calc(100dvh), 'all');
    }

    &:is(.width, .both) {
      @include width(calc(100dvw), 'all');
    }

    &.padding {
      padding-top: $inset-top;
      padding-left: $inset-left;
      padding-bottom: $inset-bottom;
      padding-right: $inset-right;
    }

    &.margin {
      margin-top: $inset-top;
      margin-left: $inset-left;
      margin-bottom: $inset-bottom;
      margin-right: $inset-right;
    }

    &.size {
      &:is(.height, .both) {
        @include height(calc(100dvh - $inset-top - $inset-bottom), 'all');
      }

      &:is(.width, .both) {
        @include width(calc(100dvw - $inset-left - $inset-right), 'all');
      }
    }

    &.expandable {
      max-height: unset;
      min-height: fit-content;
    }
  }
</style>
