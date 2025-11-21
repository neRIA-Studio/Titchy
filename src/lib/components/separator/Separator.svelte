<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  interface Props {
    self?:        HTMLElement;
    variant?:     'primary' | 'secondary';
    line?:        'solid' | 'dashed' | 'dotted';
    orientation?: 'horizontal' | 'vertical';
    thickness?:   's' | 'm' | 'l';
  }

  let {
    self        = $bindable(),
    variant     = 'secondary',
    line        = 'solid',
    orientation = 'horizontal',
    thickness   = 'm',
    ...rest
  }: Props & HTMLAttributes<HTMLElement> = $props();
</script>

<hr
  bind:this={self}
  {...rest}
  class={["titchy", "sep", variant, orientation, line, thickness, rest.class]}
/>

<style lang="scss">
  @use "$lib/styles/utils.scss" as *;

  $accent-color: var(--sep-accent-color, C(accent, 60%));
  $highlight-color: var(--sep-accent-highlight, C(secondary, 60%));

  @mixin sep($side: top) {
    border-#{$side}: 2px solid $highlight-color;

    &.primary   { border-#{$side}-color: $highlight-color; }
    &.secondary { border-#{$side}-color: $accent-color;    }

    &.solid  { border-#{$side}-style: solid; border-radius: V(radius-max); }
    &.dashed { border-#{$side}-style: dashed; }
    &.dotted { border-#{$side}-style: dotted; }

    &.s { border-#{$side}-width: 1.5px; }
    &.m { border-#{$side}-width: 2.5px; }
    &.l { border-#{$side}-width: 3.5px; }
  }

  :global
  .titchy.sep {
    @include flex(true);

    border: none;
    align-self: stretch;

    &.horizontal {
      min-width: 100%;
      max-width: 100%;

      @include sep(top);
    }

    &.vertical {
      min-height: 100%;
      max-height: 100%;

      @include sep(left);
    }
  }
</style>
