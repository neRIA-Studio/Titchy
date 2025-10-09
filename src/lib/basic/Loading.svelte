<script lang="ts">
  import { type Icon, Loader, LoaderCircle, LoaderPinwheel, RotateCw } from "@lucide/svelte";

  interface Props {
    fill?: boolean;
  }

  interface Props1 extends Props {
    style?:  'ellipses';
    char?:   string;
    text?:   string;
    count?:  number;
    linear?: never;
    icon?:   never;
  }

  interface Props2 extends Props {
    style?:  'throbber' | 'circle' | 'pinwheel' | 'arrow' | 'custom';
    char?:   never;
    text?:   never;
    count?:  never;
    linear?: boolean;
    icon?:   typeof Icon;
  }

  const {
    fill,
    style = 'throbber',
    char = '•',
    text,
    count = 3,
    linear,
    icon,
  }:(Props1 | Props2) = $props();
</script>

<span class="titchy loading" class:fill>
  {#if style === 'ellipses'}
    {#if text}
      <span class="text">
        {text}
      </span>
    {/if}
    {#each { length:count }, i (i)}
      <span class="dot" style:animation-delay="{0.2 * i}s">
        {char}
      </span>
    {/each}
  {:else}
    {@const Icon =
        style === 'throbber'
      ? Loader
      : style === 'circle'
      ? LoaderCircle
      : style === 'pinwheel'
      ? LoaderPinwheel
      : style === 'arrow'
      ? RotateCw
      : style === 'custom'
      ? icon
      : null}
    <div class="spinner" class:linear>
      <Icon />
    </div>
  {/if}
</span>

<style lang="scss">
  @use "@/others/utils.scss" as *;

  $spinner-color: var(--loading-spinner-color, C(accent));
  $dots-color: var(--loading-dots-color, C(secondary));
  $text-color: var(--loading-text-color, C(accent));
  $text-shine-color: var(--loading-text-shine-color, set-alpha($text-color, 25%));

  .titchy.loading {
    display: inline-flex;
    flex-direction: row;
    align-items: end;
    justify-content: center;
    height: 1.5em;
    gap: 0.25em;

    &.fill {
      flex: 1;
      align-items: center;
      justify-content: center;
    }

    .text {
      top: -3px;
      color: transparent;
      background: linear-gradient(to right, $text-color 70%, $text-shine-color, $text-color);
      -webkit-background-clip: text;
      background-clip: text;
      animation: swipe 900ms linear infinite;
      background-size: 300% 100%;
    }

    .dot {
      color: $dots-color;
      opacity: 0.25;
      animation: bounce 1.2s infinite;
    }

    .spinner {
      color: $spinner-color;
      display: inline-flex;
      animation: spin 1.2s infinite;

      &.linear {
        animation-duration: 1s;
        animation-timing-function: linear;
      }
    }
  }

  @keyframes swipe {
    0% { background-position: 150% 0; }
    100% { background-position: 0 0; }
  }

  @keyframes bounce {
    0%, 80%, 100% {
      transform: translateY(0);
      opacity: 0.25;
    }

    40% {
      transform: translateY(-0.75em);
      opacity: 1;
    }
  }

  @keyframes spin {
    0%   { rotate: 0deg; }
    100% { rotate: 360deg; }
  }
</style>
