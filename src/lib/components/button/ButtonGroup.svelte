<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  interface Props {
    self?:            HTMLDivElement;
    'remove-corner'?: 'start' | 'end' | 'both';
  }

  let {
    self                          = $bindable(),
    'remove-corner': removeCorner = 'end',
    ...rest
  }: Props & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
  bind:this={self}
  {...rest}
  class={["titchy", "button-group", `remove-${removeCorner}`, rest.class]}
>
  {@render rest.children?.()}
</div>

<style lang="scss">
  @use "$lib/styles/utils.scss" as *;

  :global
  .titchy.button-group {
    flex-direction: row;
    align-items: stretch;
    gap: 0;

    .scaling {
      &:hover, &:active {
        transform: scale(1) !important;
      }
    }

    $interactable: unquote('input.input, button.button, a.link');

    &:is(.remove-both, .remove-start) {
      > *:not(:first-child) {
        &, #{$interactable} {
          border-inline-start: none;
        }
      }
    }

    &:is(.remove-both, .remove-end) {
      > *:not(:last-child) {
        &, #{$interactable} {
          border-inline-end: none;
        }
      }
    }

    #{$interactable} { box-shadow: none; }

    > * {
      &:not(:first-child) {
        &, #{$interactable} {
          border-start-start-radius: 0;
          border-end-start-radius: 0;
        }
      }

      &:not(:last-child) {
        &, #{$interactable} {
          border-start-end-radius: 0;
          border-end-end-radius: 0;
        }
      }
    }
  }
</style>
