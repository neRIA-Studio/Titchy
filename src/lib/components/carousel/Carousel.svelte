<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { Button } from "../button";
  import { ArrowLeft, ArrowRight } from "@lucide/svelte";
  import { clamp } from "@/lib/utils";
  import { onMount } from "svelte";

  interface Props {
    self?:   HTMLDivElement;
    index?:  number;
    count?: number;
  }

  let {
    self  = $bindable(),
    index = $bindable(0),
    count = 1,
    ...rest
  }: Props & HTMLAttributes<HTMLDivElement> = $props();


  let container = $state<HTMLDivElement>();
  let content   = $state<HTMLDivElement>();

  let length      = $state<number>(0);
  let touchStartX = $state<number>(0);
  let touchEndX   = $state<number>(0);
  let swipeOffset = $state<number>(0);
  let touched   = $state<boolean>(false);

  let min = $derived(0);
  let max = $derived(length - count);

  onMount(() => {
    if (self && container) {
      const keydown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight')
          move(+1)();

        if (e.key === 'ArrowLeft')
          move(-1)();
      };

      const touchstart = (e: TouchEvent) => {
        const target    = e.target as HTMLElement;
        const clickable = target.closest("a, button, input, summary, [onclick]") !== null;

        if (!clickable)
          e.preventDefault();

        touchStartX = e.changedTouches[0].screenX;
        touched     = true;
      };

      const touchmove = (e: TouchEvent) => {
        swipeOffset = touchStartX - e.changedTouches[0].screenX;
      };

      const touchend = (e: TouchEvent) => {
        swipeOffset = 0;
        touchEndX   = e.changedTouches[0].screenX;
        touched     = false;

        if (touchStartX > touchEndX)
          move(+1)();

        if (touchStartX < touchEndX)
          move(-1)();
      };

      self.addEventListener('keydown',    keydown);
      container.addEventListener('touchstart', touchstart);
      container.addEventListener('touchmove',  touchmove);
      container.addEventListener('touchend',   touchend);

      return () => {
        if (self && container) {
          self.removeEventListener('keydown',    keydown)
          container.removeEventListener('touchstart', touchstart);
          container.removeEventListener('touchmove',  touchmove);
          container.removeEventListener('touchend',   touchend);
        }
      };
    }
  });

  $effect(() => {
    if (content) {
      const panels = content.querySelectorAll("div.titchy.panel");
      length = panels.length;
    }
  });

  const move = (n: number) => ()  => {
    let target = index + n;
    index = clamp(target, min, max);
  };
</script>

<div
  bind:this={self}
  {...rest}
  class={["titchy", "carousel", rest.class]}
  style="--count: {count}; --index: {index}; --swipe-offset: {swipeOffset}px"
  tabindex="0"
>
  <div bind:this={container} class="container">
    <div bind:this={content} class={["content", { touched }]}>
      {@render rest.children?.()}
    </div>
  </div>
  <div class="actions">
    <div class="left">
      <Button
        variant="secondary"
        class="prev"
        rounded
        scaling={false}
        onclick={move(-1)}
        disabled={index <= min}
      >
        <ArrowLeft />
      </Button>
    </div>
    <div class="right">
      <Button
        variant="secondary"
        class="next"
        rounded
        scaling={false}
        onclick={move(+1)}
        disabled={index >= max}
      >
        <ArrowRight />
      </Button>
    </div>
  </div>
</div>

<style lang="scss">
  @use "@/others/utils.scss" as *;

  $accent-color: var(--carousel-accent-color, C(accent));
  $shadow-color: var(--carousel-shadow-color, black);

  $actions-size: var(--carousel-actions-size, 36px);
  $content-width: var(--carousel-content-width, 200px);
  $gap: var(--carousel-gap, V(spacing-4));

  :global
  .titchy.carousel {
    flex-direction: row;
    align-items: center;
    gap: $gap;
    border-radius: V(radius-1);

    > .container {
      flex-direction: row;
      align-items: center;
      padding: 0 calc($actions-size + $gap * 2);
      overflow: hidden;
      gap: $gap;

      mask-image: linear-gradient(
        to left,
        transparent calc($actions-size / 2),
        white     calc($actions-size),
        white     calc(100% - $actions-size),
        transparent calc(100% - $actions-size / 2)
      );

      > .content {
        $c: var(--count);
        $i: var(--index);
        $w: calc($content-width + $gap * ($c - 1));

        @include width($w, 'all');

        flex-direction: row;
        gap: $gap;
        left: calc(-1 * ((($w + $gap) * $i) / $c) - var(--swipe-offset));

        &.touched { transition: none; }

        > .titchy.panel {
          @include width(calc($content-width / $c), 'all');
        }

        > :not(.titchy.panel) {
          display: none;
        }
      }
    }

    > .actions {
      @include fill-absolute();
      z-index: 10;
      pointer-events: none;

      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      > :is(.left, .right) {
        .titchy.button {
          pointer-events: auto;
          @include size($actions-size);
        }
      }
    }
  }
</style>
