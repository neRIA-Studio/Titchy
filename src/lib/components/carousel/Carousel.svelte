<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { Button } from "../button";
  import { ArrowLeft, ArrowRight } from "@lucide/svelte";
  import { clamp } from "@/lib/utils";
  import { onMount } from "svelte";

  interface Props {
    self?:   HTMLDivElement;
    index?:  number;
    amount?: number;
  }

  let {
    self   = $bindable(),
    index  = $bindable(0),
    amount = 1,
    ...rest
  }: Props & HTMLAttributes<HTMLDivElement> = $props();


  let content = $state<HTMLDivElement>();
  let length  = $state<number>(0);

  let touchStartX = $state(0);
  let touchEndX   = $state(0);
  let swipeOffset = $state(0);

  let min = $derived(0);
  let max = $derived(length - amount);

  onMount(() => {
    if (self) {
      const keydown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight')
          move(+1)();

        if (e.key === 'ArrowLeft')
          move(-1)();
      };

      const touchstart = (e: TouchEvent) => {
        e.preventDefault();
        touchStartX = e.changedTouches[0].screenX;
      };

      // const touchmove = (e: TouchEvent) => {
      //   e.preventDefault();
      //   swipeOffset = touchStartX - e.changedTouches[0].screenX;
      // };

      const touchend = (e: TouchEvent) => {
        swipeOffset = 0;
        touchEndX   = e.changedTouches[0].screenX;

        if (touchStartX > touchEndX)
          move(+1)();

        if (touchStartX < touchEndX)
          move(-1)();
      };

      self.addEventListener('keydown',    keydown);
      self.addEventListener('touchstart', touchstart);
      // self.addEventListener('touchmove',  touchmove);
      self.addEventListener('touchend',   touchend);

      return () => {
        if (self) {
          self.removeEventListener('keydown',    keydown)
          self.removeEventListener('touchstart', touchstart);
          // self.removeEventListener('touchmove',  touchmove);
          self.removeEventListener('touchend',   touchend);
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
  style="--amount: {amount}; --index: {index}; --swipe-offset: {swipeOffset}px"
  tabindex="0"
>
  <div class="container">
    <div bind:this={content} class="content">
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
        $a: var(--amount);
        $i: var(--index);
        $w: calc($content-width + $gap * ($a - 1));

        @include width($w, 'all');

        flex-direction: row;
        gap: $gap;
        left: calc(-1 * ((($w + $gap) * $i) / $a) - var(--swipe-offset));

        > .titchy.panel {
          @include width(calc($content-width / $a), 'all');
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
