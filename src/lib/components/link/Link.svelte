<script lang="ts">
  import type { HTMLAnchorAttributes, MouseEventHandler } from "svelte/elements";

  interface Props {
    self?:     HTMLAnchorElement;
    variant?:  'anchor' | 'wrapper';
    disabled?: boolean;
    external?: boolean;
    scaling?: boolean;
  }

  let {
    self = $bindable(),
    variant = 'anchor',
    disabled,
    external,
    scaling,
    ...rest
  }: Props & HTMLAnchorAttributes = $props();

  const onclick: MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (disabled)
      e.preventDefault();
    rest.onclick?.(e);
  };
</script>

<a
  bind:this={self}
  {...rest}
  class={["titchy", "link", variant, { disabled, scaling }, rest.class]}
  target={rest.target ?? (external ? "_blank" : undefined)}
  {onclick}
>
  {@render rest.children?.()}
</a>

<style lang="scss">
  @use "$lib/styles/utils.scss" as *;

  $accent-color: var(--link-accent-color, C(accent));

  :global
  .titchy.link {
    &.anchor {
      color: $accent-color;
      text-decoration: underline dashed set-alpha($accent-color, 50%) 1px;
      text-underline-offset: 2px;
    }

    &.wrapper {
      @include flex(true);
      @include default();
      cursor: pointer;
    }

    &:hover:not(.disabled) {
      &.scaling { transform: scale(1.05); }
      opacity: 1;
    }

    &:active:not(.disabled) {
      &.scaling { transform: scale(0.95); }
      opacity: 0.75;
    }

    &.disabled {
      cursor: not-allowed;
      opacity: 0.35;
    }
  }
</style>
