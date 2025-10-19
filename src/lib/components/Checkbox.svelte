<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { blur } from "svelte/transition";
  import { Check, Circle, type Icon, X } from "@lucide/svelte";

  import { Button } from ".";

  interface Props {
    active?: boolean;
    symbol?: 'hollow' | 'check' | 'x' | 'radio' | 'custom' | typeof Icon;
  }

  let {
    active = $bindable(false),
    symbol = 'hollow',
    ...rest
  }: Props & ComponentProps<typeof Button> = $props();
</script>

{#snippet active_symbol()}
  {@const Symbol =
      symbol === 'hollow' ? null
    : symbol === 'check'  ? Check
    : symbol === 'x'      ? X
    : symbol === 'radio'  ? Circle
    : symbol === 'custom' ? null
    : symbol}

  <div
    class={["active-symbol", typeof symbol === 'string' ? symbol : "custom"]}
    transition:blur={{ duration:300 }}
  >
    {#if Symbol}
      <Symbol />
    {/if}
  </div>
{/snippet}

<Button
  variant="secondary"
  {...rest}
  class={["checkbox", { active }, rest.class]}
  onclick={rest.onclick ?? (() => active =! active)}
>
  {#if symbol === 'custom'}
    {@render rest.children?.()}
  {:else if active}
    {@render active_symbol()}
  {/if}
</Button>

<style lang="scss">
  @use "@/others/utils.scss" as *;

  $size:  var(--checkbox-size, V(spacing-7));
  $accent-color: var(--checkbox-accent-color, C(accent));

  :global
  .titchy.button.checkbox {
    &.checkbox {
      @include size($size, $both:true);
      padding: 0;
      border: none;
      overflow: hidden;
    }

    &:is(.active) {
      color: $accent-color;
      background-color: set-alpha($accent-color, 15%);
      &:hover { background-color: set-alpha($accent-color, 20%); }
    }

    .active-symbol {
      align-items: center;
      justify-content: center;

      &.hollow {
        @include size(calc($size / 1.5), $both:true);
        border-radius: calc(V(radius-1) / 1.5);
        background-color: $accent-color;
      }

      &.check :global(svg) {
        stroke-width: 4px;
        @include size(calc($size / 1.5), $both:true);
      }

      &.x :global(svg) {
        stroke-width: 4px;
        @include size(calc($size / 1.5), $both:true);
      }

      &.radio :global(svg) {
        stroke-width: 4px;
        @include size(calc($size / 1.75), $both:true);
      }

      // &.custom :global(svg) { }
    }
  }
</style>
