<script lang="ts">
  import { type Icon, Loader, LoaderCircle, LoaderPinwheel, RotateCw } from "@lucide/svelte";

  interface Props {
    self?:     HTMLSpanElement;
    flexible?: boolean;
    duration?: number;
  }

  interface Props1 extends Props {
    variant?: 'ellipses';

    char?:    string;
    text?:    string | boolean;
    count?:   number;
    delay?:   number | "auto";
    stretch?: boolean;

    icon?:    never;
    linear?:  never;
  }

  interface Props2 extends Props {
    variant?: 'spinner';

    char?:    never;
    text?:    never;
    count?:   never;
    delay?:   never;
    stretch?: never;

    icon?:    'circle' | 'throbber' | 'pinwheel' | 'arrow' | typeof Icon;
    linear?:  boolean;
  }

  let {
    self = $bindable(),
    flexible,
    duration = 1000,

    variant = 'spinner',
    char = '•',
    text,
    count = 3,
    delay = 'auto',
    stretch,

    icon = 'circle',
    linear,
  }: (Props1 | Props2) = $props();
</script>

{#snippet spinner()}
  {@const Icon =
      icon === 'throbber'
    ? Loader
    : icon === 'circle'
    ? LoaderCircle
    : icon === 'pinwheel'
    ? LoaderPinwheel
    : icon === 'arrow'
    ? RotateCw
    : icon}
  <div
    class="spinner"
    class:linear
    style:animation-duration="{duration}ms"
  >
    <Icon />
  </div>
{/snippet}

<span
  bind:this={self}
  class={["titchy", "loading", variant]}
  class:flexible
>
  {#if variant === 'ellipses'}
    {#if text}
      <span class="text">
        {text === true ? "Loading" : text}
      </span>

    {/if}
    {#each { length:count }, i (i)}
      <span
        class="dot"
        class:stretch
        class:has-text={text}
        style:animation-delay="{(delay === 'auto' ? duration / (count+1) : delay) * i }ms"
        style:animation-duration="{duration}ms"
      >
        {char}
      </span>
    {/each}
  {:else if variant === 'spinner'}
    {@render spinner()}
  {/if}
</span>

<style lang="scss">
  @use "$lib/styles/utils.scss" as *;

  $spinner-color: var(--loading-spinner-color, C(accent));
  $dots-color: var(--loading-dots-color, C(secondary));
  $text-color: var(--loading-text-color, C(accent));
  $text-shine-color: var(--loading-text-shine-color, set-alpha($text-color, 25%));

  :global
  .titchy.loading {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 1.5em;
    gap: 0.25em;

    &.flexible {
      flex: 1;
      align-items: center;
      justify-content: center;
    }

    &.ellipses {
      align-items: end;
    }

    .text {
      color: transparent;
      background: linear-gradient(to right, $text-color 70%, $text-shine-color, $text-color);
      -webkit-background-clip: text;
      background-clip: text;
      background-size: 300% 100%;

      animation-name: swipe;
      animation-duration: 1s;
      animation-timing-function: ease;
      animation-iteration-count: infinite;
    }

    .dot {
      color: $dots-color;
      opacity: 0.25;
      transform-origin: bottom;

      animation-name: bounce;
      animation-timing-function: ease;
      animation-iteration-count: infinite;

      &.stretch  { animation-name: bounce-with-stretch; }
      &.has-text { inset-block-start: 5px; }
    }

    .spinner {
      color: $spinner-color;
      display: inline-flex;

      animation-name: spin;
      animation-timing-function: ease;
      animation-iteration-count: infinite;

      &.linear { animation-timing-function: linear; }

      > svg {
        @include size(25px);
      }
    }
  }

  @keyframes swipe {
    0% { background-position: 150% 0; }
    100% { background-position: 0 0; }
  }

  @keyframes bounce {
    0%, 80%, 100% {
      transform: none;
      opacity: 0.25;
    }

    40% {
      transform: translateY(-0.66em);
      opacity: 1;
    }
  }

  @keyframes bounce-with-stretch {
    0%, 80%, 100% {
      transform: none;
      opacity: 0.25;
    }

    20% {
      transform: scaleY(2);
    }

    40% {
      transform: translateY(-0.66em);
      opacity: 1;
    }
  }

  @keyframes spin {
    0%   { rotate: 0deg; }
    100% { rotate: 360deg; }
  }
</style>
