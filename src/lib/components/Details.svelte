<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLDetailsAttributes } from "svelte/elements";
  import { ChevronLast, ChevronRight, ChevronsLeftRight, ChevronsRight, CircleChevronRight, SquareChevronRight, type Icon } from "@lucide/svelte";

  interface Props {
    self?:         HTMLDetailsElement;
    icon?:         'single' | 'double' | 'circle' | 'square' | 'dashed' | typeof Icon;
    summary:       Snippet | string;
    content?:      Snippet | string;
    children?:     Snippet;
    'no-padding'?: boolean;
  }

  let {
    self = $bindable(),
    open = $bindable(false),
    icon,
    summary,
    content,
    children,
    'no-padding': noPadding,
    ...rest
  }: Props & HTMLDetailsAttributes = $props();
</script>

{#snippet chevron()}
  {@const Chevron =
      icon === 'single' ? ChevronRight
    : icon === 'double' ? ChevronsRight
    : icon === 'circle' ? CircleChevronRight
    : icon === 'square' ? SquareChevronRight
    : icon === 'dashed' ? ChevronLast
    : icon}

  <Chevron class="chevron" />
{/snippet}

<details
  bind:this={self}
  bind:open
  {...rest}
  class={["titchy", "details", rest.class]}
  class:has-chevron={icon}
>
  <summary>
    {#if icon}
      {@render chevron()}
    {/if}
    {#if typeof summary === 'string'}
      {summary}
    {:else}
      {@render summary()}
    {/if}
  </summary>
  <content>
    {#if typeof content === 'string'}
      {content}
    {:else if content}
      {@render content()}
    {:else}
      {@render children?.()}
    {/if}
  </content>
</details>

<style lang="scss">
  @use "@/others/utils.scss" as *;

  $accent-color: var(--details-accent-color, C(accent));
  $opacity: var(--details-opacity, 7.5%);

  :global
  .titchy.details {
    // overflow: hidden;
    min-height: fit-content;

    border: 2px solid $accent-color;
    border-radius: V(radius-1);

    background-color: set-alpha($accent-color, 5%);
    border-color: set-alpha($accent-color, 50%);
    backdrop-filter: blur(8px);

    > summary {
      flex-direction: row;
      align-items: center;
      gap: 1ch;

      padding: 10px;
      font-weight: bold;
      cursor: pointer;

      border-width: 0;
      border-style: solid;
      border-color: set-alpha($accent-color, 15%);
      border-radius: calc(V(radius-1) - 2px);

      &:focus-visible {
        outline-offset: V(spacing-2);
      }

      &::before {
        content: "";
        @include default();
        @include size(V(spacing-5));
        border: 2px dotted $accent-color;
        border-radius: 50%;
      }
    }

    &::details-content {
      @include default();
      height: 0; block-size: 0;
    }

    > content {
      gap: 10px;
      padding: 10px;
      transform-origin: top;
      transform: scale(0.85);
      opacity: 0;
      filter: blur(15px);
    }

    &.has-chevron > summary {
      &::before { content: none; }

      > svg.chevron {
        @include size(V(spacing-5));
        stroke-width: 4px;
        color: $accent-color;
      }
    }
  }

  :global
  .titchy.details[open] {
    > summary {
      background-color: set-alpha($accent-color, 7.5%);
      border-bottom-width: 2px;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;

      &::before {
        background-color: set-alpha($accent-color, 35%);
        border-style: solid;
        rotate: 2turn;
      }
    }


    &::details-content {
      height: fit-content; block-size: fit-content;
    }

    > content {
      transform: scale(1);
      opacity: 1;
      filter: none;
    }

    &.has-chevron > summary {
      > svg.chevron { rotate: 90deg; }
    }
  }
</style>
