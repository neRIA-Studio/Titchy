<script lang="ts" generics="P extends HTMLElement | never = never">
  import { untrack } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { slide } from "svelte/transition";

  import { objToCss } from "$lib/utils";

  function px(value: number) {
    return `${Math.round(value * 10) / 10}px`;
  }

  interface Props {
    self?:           HTMLDivElement;
    active?:         boolean;
    parent?:         P;
    axis?:           "y" | "x";
    anchor?:         "end" | "start";
    'axis-center'?:  P extends never ? never : boolean;
    'inherit-size'?: P extends never ? never : ('none' | 'width' | 'height' | 'both');
  }

  type Position = Record<"top" | "left" | "bottom" | "right" | "width" | "height", string>;

  let {
    self                        = $bindable(),
    active                      = $bindable(false),
    parent,
    axis                        = "y",
    anchor                      = "end",
    'axis-center': axisCenter   = true as Props['axis-center'],
    'inherit-size': inheritSize = "none" as Props['inherit-size'],
    ...rest
  }: Props & HTMLAttributes<HTMLDivElement> = $props();

  let pos = $state<Position>({ } as Position);

  // Janky
  const calculatePosition = () => {
    if (!parent || !self)
      return;

    const goEnd = () => {
      if (axis === 'y') pos.top  = px(Math.max(parentRect.bottom, 0));
      if (axis === 'x') pos.left = px(Math.max(parentRect.right,  0));
    }

    const goStart = () => {
      if (axis === 'y') pos.bottom = px(Math.max(height - parentRect.top, 0));
      if (axis === 'x') pos.right  = px(Math.max(width - parentRect.left, 0));
    }

    const width  = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;

    const selfRect   = self.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    const nearTop    = parentRect.top - selfRect.height <= 0;
    const nearBottom = parentRect.bottom + selfRect.height <= height;
    const nearLeft   = parentRect.left - selfRect.width <= 0;
    const nearRight  = parentRect.right + selfRect.width <= width;

    const nearStart  = axis === 'y' ? nearBottom : nearRight;
    const nearEnd    = axis === 'y' ? nearTop    : nearLeft;

    pos = { } as Position;

    // Calculating the size
    if (inheritSize === 'width' || inheritSize === 'both')
      pos.width = px(parentRect.width);

    if (inheritSize === 'height' || inheritSize === 'both')
      pos.height = px(parentRect.height);

    // Calculating the justification
    if (axis === 'y') {
      if (axisCenter)
        pos.left = px(Math.max(parentRect.left - (selfRect.width - parentRect.width) / 2, 0));
      else if (parentRect.left + selfRect.width > width)
        pos.right = px(Math.max(width - parentRect.right, 0));
      else
        pos.left = px(Math.max(parentRect.left, 0));
    }

    if (axis === 'x') {
      if (axisCenter)
        pos.top = px(Math.max(parentRect.top - (selfRect.height - parentRect.height) / 2, 0));
      else if (parentRect.top + selfRect.height > height)
        pos.bottom = px(Math.max(height - parentRect.bottom, 0));
      else
        pos.top = px(Math.max(parentRect.top, 0));
    }

    // Calculating the alignment
    if (anchor === "end") {
      if (nearStart) goEnd();
      else goStart();
    }

    if (anchor === "start") {
      if (nearEnd) goEnd();
      else goStart();
    }
  };

  $effect(() => {
    untrack(calculatePosition);
    [parent, active];
  });

  $effect(() => {
    if (!parent || !self)
      return;

    const observer = new ResizeObserver(calculatePosition);
    observer.observe(self);
    observer.observe(parent);
    observer.observe(document.documentElement);

    document.addEventListener('scroll', calculatePosition);
    document.addEventListener('focusin', calculatePosition);

    return () => {
      if (!parent || !self)
        return;

      observer.disconnect();
      document.removeEventListener('scroll', calculatePosition)
      document.removeEventListener('focusin', calculatePosition)
    };
  });
</script>

{#if active}
  <div
    bind:this={self}
    class={["titchy", "popover", axis, anchor, { parented:!!parent }]}
    transition:slide={{ axis }}
    style={objToCss(pos)}
  >
    {@render rest.children?.()}
  </div>
{:else}
  <div class="titchy popover shadow">
    {@render rest.children?.()}
  </div>
{/if}

<style lang="scss">
  @use "$lib/styles/utils.scss" as *;

  $accent-color: var(--popover-accent-color, C(accent));
  $gap: var(--popover-gap, V(spacing-2));

  :global
  .titchy.popover {
    z-index: 10;
    gap: $gap;

    &:not(.parented) {
      position: absolute;
      @include width(100%, 'all');

      &.y {
        padding: $gap 0;

        &.end   { top: 100%;    }
        &.start { bottom: 100%; }
      }

      &.x {
        padding: 0 $gap;

        &.end   { left: 100%;  }
        &.start { right: 100%; }
      }
    }

    &.parented {
      $t: var(--top);
      $b: var(--bottom);
      $l: var(--left);
      $r: var(--right);

      $w: var(--width);
      $h: var(--height);

      position: fixed;
      transition: none;
      width: calc($w);
      height: calc($h);

      top: $t;
      bottom: $b;
      left: $l;
      right: $r;

      &.y {
        top: calc($t + $gap);
        bottom: calc($b + $gap);
      }

      &.x {
        left: calc($l + $gap);
        right: calc($r + $gap);
      }
    }
  }

  :global
  .titchy.popover.shadow {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    pointer-events: none !important;
  }
</style>
