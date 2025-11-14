<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "@lucide/svelte";

  import { Button } from "../button";

  interface Props {
    self?:                HTMLDivElement;
    value?:               number;
    min?:                 number;
    max?:                 number;
    label?:               string;
    flexible?:            boolean;
    'content-placement'?: 'top' | 'bottom';
  }

  let {
    self                            = $bindable(),
    min                             = 1,
    max                             = Infinity,
    value                           = $bindable(min),
    label                           = undefined,
    flexible                        = false,
    'content-placement': cntntPlace = 'bottom',
    ...rest
  }: Props & HTMLAttributes<HTMLDivElement> = $props();

  let labelSpan = $state<HTMLSpanElement>();

  $effect.pre(() => {
    if (label && labelSpan) {
      labelSpan.innerHTML = label
        .replace(
          /(?<!\\)\$page\$/,
          `<span class="number">${value.toLocaleString()}</span>`
        )
        .replace(
          /\\\$page\$/,
          `$page$`
        );
    }
  });

  const modify = (n: number) => () => {
    const target = value + n;

    if (min <= target && target <= max)
      value = target;
  };

  const set = (target: number) => () => {
    if (min <= target && target <= max)
      value = target;
  };
</script>

<div
  bind:this={self}
  {...rest}
  class={["titchy", "pager", { flexible }, rest.class]}
>
  {#if cntntPlace === 'top'}
    {@render rest.children?.()}
  {/if}

  <div class="content">
    <div class="actions prev">
      <Button class="last" onclick={set(min)} disabled={value <= min}>
        <ChevronsLeft />
      </Button>
      <Button class="add" onclick={modify(-1)} disabled={value <= min}>
        <ChevronLeft />
      </Button>
    </div>

    <span bind:this={labelSpan} class="label">
      {#if !label}
        Page <span class="number">{value.toLocaleString()}</span>
      {/if}
    </span>

    <div class="actions next">
      <Button class="sub" onclick={modify(+1)} disabled={value >= max}>
        <ChevronRight />
      </Button>
      <Button class="first" onclick={set(max)} disabled={value >= max}>
        <ChevronsRight />
      </Button>
    </div>
  </div>

  {#if cntntPlace === 'bottom'}
    {@render rest.children?.()}
  {/if}
</div>

<style lang="scss">
  @use "$lib/styles/utils.scss" as *;

  $accent-color: var(--pager-accent-color, C(accent));
  $icon-size: var(--pager-icon-size, V(spacing-8));
  $gap: var(--pager-gap, V(spacing-4));

  :global
  .titchy.pager {
    gap: $gap;
    padding: $gap;
    border: 2px solid set-alpha($accent-color, 25%);
    border-radius: V(radius-1);
    background-color: set-alpha($accent-color, 10%);

    &.flexible { flex: 1; }

    .content {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: $gap;

      .label {
        font-size: V(text-xl);
        font-weight: bold;

        .number { color: $accent-color; }
      }

      .actions {
        flex-direction: row;
        align-items: center;
        gap: $gap;

        > button {
          --button-accent-color: #{$accent-color};
          @include size(unset, 'all');
          padding: 0;

          > svg { @include size($icon-size); }
        }
      }
    }
  }
</style>
