<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  interface Props {
    self?: HTMLDivElement;
  }

  let {
    self = $bindable(),
    ...rest
  }: Props & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
  bind:this={self}
  {...rest}
  class={["titchy", "button-group", rest.class]}
>
  {@render rest.children?.()}
</div>

<style lang="scss">
  @use "@/others/utils.scss" as *;

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

    > * {
      box-shadow: none;

      &:not(:first-child) {
        &, .input, .button {
          border-left: none;
          border-top-left-radius: 0px;
          border-bottom-left-radius: 0px;
        }
      }

      &:not(:last-child) {
        &, .input, .button {
          border-top-right-radius: 0px;
          border-bottom-right-radius: 0px;
        }
      }
    }
  }
</style>
