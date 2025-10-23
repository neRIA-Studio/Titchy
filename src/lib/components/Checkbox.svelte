<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { blur } from "svelte/transition";
  import { Check, Circle, type Icon, X } from "@lucide/svelte";

  import { Button } from ".";

  interface Props {
    self?:    HTMLButtonElement;
    active?: boolean;
    icon?: 'hollow' | 'check' | 'x' | 'radio' | 'custom' | typeof Icon;
  }

  let {
    self = $bindable(),
    active = $bindable(false),
    icon = 'hollow',
    ...rest
  }: Props & ComponentProps<typeof Button> = $props();
</script>

{#snippet checkmark()}
  {@const Icon =
      icon === 'hollow' ? null
    : icon === 'check'  ? Check
    : icon === 'x'      ? X
    : icon === 'radio'  ? Circle
    : icon === 'custom' ? null
    : icon}

  <div
    class={["symbol", typeof icon === 'string' ? icon : "custom"]}
    transition:blur={{ duration:300 }}
  >
    {#if Icon}
      <Icon />
    {/if}
  </div>
{/snippet}

<Button
  bind:self
  variant="secondary"
  {...rest}
  class={["checkbox", { active }, rest.class]}
  onclick={rest.onclick ?? (() => active =! active)}
>
  {#if icon === 'custom'}
    {@render rest.children?.()}
  {:else if active}
    {@render checkmark()}
  {/if}
</Button>

<style lang="scss">
  @use "@/others/utils.scss" as *;

  $size:  var(--checkbox-size, V(spacing-7));
  $accent-color: var(--checkbox-accent-color, C(accent));

  :global
  .titchy.button.checkbox {
    &.checkbox {
      @include size($size, 'all');
      padding: 0;
      border: none;
      overflow: hidden;
    }

    &:is(.active) {
      color: $accent-color;
      background-color: set-alpha($accent-color, 15%);
      &:hover { background-color: set-alpha($accent-color, 20%); }
    }

    .symbol {
      align-items: center;
      justify-content: center;

      &.hollow {
        @include size(calc($size / 1.5), 'all');
        border-radius: calc(V(radius-1) / 1.5);
        background-color: $accent-color;
      }

      &.check :global(svg) {
        stroke-width: 4px;
        @include size(calc($size / 1.5), 'all');
      }

      &.x :global(svg) {
        stroke-width: 4px;
        @include size(calc($size / 1.5), 'all');
      }

      &.radio :global(svg) {
        stroke-width: 4px;
        @include size(calc($size / 1.75), 'all');
      }

      // &.custom :global(svg) { }
    }
  }
</style>
