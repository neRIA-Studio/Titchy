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
  class={["titchy", "screen", `safe-area-${safeArea}`, `fill-${fill}`, { expandable }, rest.class]}
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

    &:is(.fill-width,  .fill-both) { @include  width(calc(100dvw), 'all'); }
    &:is(.fill-height, .fill-both) { @include height(calc(100dvh), 'all'); }

    &.safe-area-padding {
      padding-top:    $inset-top;
      padding-left:   $inset-left;
      padding-bottom: $inset-bottom;
      padding-right:  $inset-right;
    }

    &.safe-area-margin {
      margin-top:    $inset-top;
      margin-left:   $inset-left;
      margin-bottom: $inset-bottom;
      margin-right:  $inset-right;
    }

    &.safe-area-size {
      &:is(.fill-width,  .fill-both) { @include  width(calc(100dvw - $inset-left - $inset-right), 'all'); }
      &:is(.fill-height, .fill-both) { @include height(calc(100dvh - $inset-top - $inset-bottom), 'all'); }
    }

    &.expandable {
      &:is(.fill-width,  .fill-both) { width:  fit-content; max-width:  unset; }
      &:is(.fill-height, .fill-both) { height: fit-content; max-height: unset; }
    }
  }
</style>
