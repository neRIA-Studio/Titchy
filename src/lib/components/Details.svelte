<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLDetailsAttributes } from "svelte/elements";

  interface Props {
    summary: Snippet | string;
    content?: Snippet | string;
    children?: Snippet;
    'no-padding'?: boolean;
  }

  let {
    open = $bindable(false),
    summary,
    content,
    children,
    'no-padding': noPadding,
    ...rest
  }: Props & HTMLDetailsAttributes = $props();
</script>

<details
  {...rest}
  {open}
  class={["titchy", "details", rest.class]}
>
  <summary>
    {#if typeof summary === 'string'}
      {summary}
    {:else}
      {@render summary()}
    {/if}
  </summary>
  <content>
    {#if typeof content === 'string'}
      {content}
    {:else if content}
      {@render content()}
    {:else}
      {@render children?.()}
    {/if}
  </content>
</details>

<style lang="scss">
  @use "@/others/utils.scss" as *;

  $accent-color: var(--details-accent-color, C(accent));
  $opacity: var(--details-opacity, 7.5%);

  :global
  .titchy.details {
    overflow: hidden;
    min-height: fit-content;

    border: 2px solid $accent-color;
    border-radius: V(radius-1);

    background-color: set-alpha($accent-color, 5%);
    border-color: set-alpha($accent-color, 50%);
    backdrop-filter: blur(8px);

    > summary {
      flex-direction: row;
      align-items: center;
      gap: 1ch;

      padding: 10px;
      font-weight: bold;
      cursor: pointer;

      border-width: 0;
      border-style: solid;
      border-color: set-alpha($accent-color, 15%);

      &::before {
        content: "";
        @include default();
        @include size(12px);
        border: 2px dotted $accent-color;
        border-radius: 50%;
      }
    }

    &::details-content {
      @include default();
      height: 0; block-size: 0;
    }

    > content {
      gap: 10px;
      padding: 10px;
      transform-origin: top;
      transform: scale(0.85);
      opacity: 0;
      filter: blur(15px);
    }
  }

  details[open] {
    > summary {
      border-bottom-width: 2px;
      background-color: set-alpha($accent-color, 7.5%);

      &::before {
        background-color: set-alpha($accent-color, 35%);
        border-style: solid;
        rotate: 2turn;
      }
    }


    &::details-content {
      height: fit-content; block-size: fit-content;
    }

    > content {
      transform: scale(1);
      opacity: 1;
      filter: none;
    }
  }
</style>
