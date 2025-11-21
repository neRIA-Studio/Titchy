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
    variant     = 'primary',
    line        = 'solid',
    orientation = 'horizontal',
    thickness   = 'm',
    ...rest
  }: Props & HTMLAttributes<HTMLElement> = $props();
</script>

<hr
  bind:this={self}
  {...rest}
  class={["titchy", "separator", variant, orientation, line, thickness, rest.class]}
/>

<style lang="scss">
  @use "$lib/styles/utils.scss" as *;

  $accent-color: var(--separator-accent-color, C(accent, 60%));
  $highlight-color: var(--separator-accent-highlight, C(secondary, 60%));

  @mixin separator($side: top) {
    border-#{$side}: 2px solid $highlight-color;

    &.primary   { border-#{$side}-color: $highlight-color; }
    &.secondary { border-#{$side}-color: $accent-color;    }

    &.solid  { border-#{$side}-style: solid; border-radius: V(radius-max); }
    &.dashed { border-#{$side}-style: dashed; }
    &.dotted { border-#{$side}-style: dotted; }

    &.s { border-#{$side}-width: 0.5px; }
    &.m { border-#{$side}-width: 2.0px; }
    &.l { border-#{$side}-width: 5.0px; }
  }

  :global
  .titchy.separator {
    @include flex(true);

    border: none;
    align-self: stretch;

    &.horizontal {
      min-width: 100%;
      max-width: 100%;

      @include separator(top);
    }

    &.vertical {
      min-height: 100%;
      max-height: 100%;

      @include separator(left);
    }
  }
</style>
