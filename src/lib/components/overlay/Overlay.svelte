<script lang="ts">
  import { onMount } from "svelte";
  import type { HTMLAttributes, MouseEventHandler } from "svelte/elements";
  import { blur } from "svelte/transition";

  interface Props {
    self?:   HTMLDivElement;
    active?: boolean;
    fill?:   "absolute" | "fixed";
    center?: boolean;
  }

  let {
    self   = $bindable(),
    active = $bindable(true),
    fill   = "fixed",
    center,
    ...rest
  }: Props & HTMLAttributes<HTMLDivElement> = $props();

  const onclick: MouseEventHandler<HTMLDivElement> = e => {
    if (e.target === self)
      active = false;
  };

  onMount(() => {
    const onkeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape")
        active = false;
    };

    window.addEventListener("keydown", onkeydown);
    return () => window.removeEventListener("keydown", onkeydown);
  });

  $effect(() => {
    if (fill === "fixed")
      document.body.style.overflow = active ? "hidden" : "auto";
  });
</script>

{#if active}
  <div
    bind:this={self}
    {...rest}
    class={["titchy", "overlay", fill, { center, active }, rest.class]}
    onclick={rest.onclick ?? onclick}
    transition:blur
  >
    {@render rest.children?.()}
  </div>
{/if}

<style lang="scss">
  @use "@/others/utils.scss" as *;

  $z-index: var(--overlay-z-index, 10);
  $bg-color: var(--overlay-background-color, C(primary, 50%));

  :global
  .titchy.overlay {
    z-index: $z-index;
    background-color: $bg-color;
    backdrop-filter: blur(5px);

    &.absolute { @include fill-absolute(); }
    &.fixed    { @include fill-fixed();    }
    &.center   { @include flex-center();   }
  }
</style>
