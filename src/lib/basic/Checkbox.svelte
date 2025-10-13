<script lang="ts">
  import { Check, Circle, X } from "@lucide/svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";
  import { blur } from "svelte/transition";

  import { Button } from ".";

  interface Props {
    active?: boolean;
    style?: 'hollow' | 'check' | 'x' | 'radio' | 'custom';
  }

  let { active = $bindable(false), style = 'hollow', ...rest }:Props & HTMLButtonAttributes = $props();
</script>

{#snippet active_symbol()}
  {@const Symbol =
      style === 'hollow' ? null
    : style === 'check'  ? Check
    : style === 'x'      ? X
    : style === 'radio'  ? Circle
    : style === 'custom' ? null
    : null}

  <div class={["active-symbol", style]} transition:blur={{ duration:300 }}>
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
  {#if style === 'custom'}
    {@render rest.children?.()}
  {:else if active}
    {@render active_symbol()}
  {/if}
</Button>

<style lang="scss">
  @use "@/others/utils.scss" as *;

  $size:  var(--checkbox-size, 30px);
  $accent-color: var(--checkbox-accent-color, C(accent));

  :global
  .titchy.button.checkbox {
    @include size($size, $both:true);

    padding: 0;
    border: none;
    overflow: hidden;

    align-items: center;
    justify-content: center;

    &:is(.active) {
      color: $accent-color;
      background-color: set-alpha($accent-color, 15%);
      &:hover { background-color: set-alpha($accent-color, 20%); }
    }

    .active-symbol {
      align-items: center;
      justify-content: center;

      :global(svg) { stroke-width: 4px; }

      &.hollow {
        @include size(calc($size / 1.5), $both:true);
        border-radius: calc(V(radius-1) / 1.5);
        background-color: $accent-color;
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
