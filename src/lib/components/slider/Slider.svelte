<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";

  interface Props {
    self?:  HTMLInputElement;
    value?: number;
    type?:  'range';
  }

  let {
    self  = $bindable(),
    value = $bindable(0),
    min   = 0,
    max   = 100,
    type  = 'range',
    ...rest
  }: Props & HTMLInputAttributes = $props();

  $effect(() => {
    if (self) {
      self.setAttribute('value', value);
      self.style.setProperty('--progress', `${value}%`);
    }
  });
</script>

<input
  bind:this={self}
  bind:value
  {min} {max}
  {...rest}
  class={["titchy", "slider", rest.class]}
  type="range"
/>

<style lang="scss">
  @use "@/others/utils.scss" as *;

  $accent-color: var(--slider-accent-color, C(accent));
  $highlight-color: var(--slider-highlight-color, C(secondary));

  $min-width: var(--slider-min-width, 200px);
  $track-height: var(--slider-track-height, V(spacing-4));
  $progress-padding: var(--slider-progress-padding, V(spacing-1));
  $thumb-size: var(--slider-thumb-size, V(spacing-6));

  @mixin track {
    &::-webkit-slider-container { @content; }
    &::-moz-range-track         { @content; }
  }

  @mixin progress {
    // Fuck Blink
    &::before {
      content: '';

      position: absolute;
      top: $progress-padding;
      left: $progress-padding;

      max-width: calc(100% - 2 * $progress-padding);
      width: var(--progress, 0%);

      @content;
    }

    // Fuck Gecko
    &::-moz-range-progress { @content; }

    /*
      And I hope WebKit burns in hell, neither of these work there.
      The slider is not gonna have a progress bar there.
      Fuck WebKit.
    */
  }

  @mixin thumb {
    &::-webkit-slider-thumb { @content; }
    &::-moz-range-thumb     { @content; }
  }

  :global
  .titchy.slider[type="range"] {
    @include flex(true);
    @include default();

    min-width: $min-width;
    accent-color: $accent-color;
    border-radius: V(radius-max);

    @include track {
      @include default();
      @include height($track-height, 'all');

      appearance: none;
      background-color: set-alpha($accent-color, 15%);

      padding: 0;
      border-radius: V(radius-max);
    }

    @include progress() {
      @include height(calc($track-height - 2 * $progress-padding), 'all');
      background-color: set-alpha($accent-color, 50%);
      border-radius: V(radius-max);
    }

    @include thumb {
      @include default();
      @include size($thumb-size, 'all');

      appearance: none;
      background-color: mix($accent-color 35%, C(primary));

      border: 2px solid $accent-color;
      border-radius: V(radius-max);
    }

    &:hover:not(:disabled) {
      @include thumb {
        cursor: pointer;
        background-color: set-alpha($accent-color, 60%, true);
      }
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
</style>
