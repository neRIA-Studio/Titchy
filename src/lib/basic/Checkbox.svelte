<script lang="ts">
  import { Check, Circle, X } from "@lucide/svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";
  import { blur } from "svelte/transition";

  interface Props {
    active?: boolean;
    style?: 'hollow' | 'check' | 'x' | 'radio' | 'custom';
  }

  let { active = $bindable(false), style = 'hollow', ...rest }:Props & HTMLButtonAttributes = $props();
</script>

{#snippet active_symbol()}
  <div class={["active-symbol", style]} transition:blur={{ duration:300 }}>
    {#if      style === 'hollow'}
      {null}
    {:else if style === 'check'}
      <Check />
    {:else if style === 'x'}
      <X />
    {:else if style === 'radio'}
      <Circle />
    {:else if style === 'custom'}
      {null}
    {/if}
  </div>
{/snippet}

<button
  data-variant={active ? "main" : "hollow"}
  {...rest}
  class={["titchy", "checkbox", `style-${style}`, rest.class]}
  class:active
  onclick={rest.onclick ?? (() => active =! active)}
>
  {#if style === 'custom'}
    {@render rest.children?.()}
  {:else if active}
    {@render active_symbol()}
  {/if}
</button>

<style lang="scss">
  @use "@/others/utils.scss" as *;

  $size:  var(--checkbox-size, 30px);
  $color: var(--checkbox-color, C(accent));

  .titchy.checkbox {
    @include size($size, $both:true);

    font-weight: 900;
    align-items: center;
    justify-content: center;
    border: 2px solid C(secondary, 2.5%);
    border-radius: V(radius-1);
    overflow: hidden;

    &.active {
      color: $color;
      background-color: set-alpha($color, 10%);
      &:hover { background-color: set-alpha($color, 20%); }
    }

    &:not(.active) {
      background-color: C(primary);
      &:hover { background-color: C(tertiary); }
    }

    .active-symbol {
      align-items: center;
      justify-content: center;

      :global(svg) {
        color: $color;
        stroke-width: 4px;
      }

      &.hollow {
        @include size(calc($size / 1.5), $both:true);
        border-radius: calc(V(radius-1) / 1.5);
        background-color: $color;
      }

      &.check :global(svg) {
        @include size(calc($size / 1.5), $both:true);
      }

      &.x :global(svg) {
        @include size(calc($size / 1.5), $both:true);
      }

      &.radio :global(svg) {
        @include size(calc($size / 1.75), $both:true);
      }
    }
  }
</style>
