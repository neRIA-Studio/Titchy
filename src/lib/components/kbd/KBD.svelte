<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  interface Props {
    self?: HTMLDivElement;
    key: string | string[];
  }

  let {
    self = $bindable(),
    key,
    ...rest
  }: Props & HTMLAttributes<HTMLDivElement> = $props();

  const keys = $derived(typeof key === 'string' ? [key] : key);
</script>

{#each keys as key, i (i)}
  <div
    bind:this={self}
    {...rest}
    class={["titchy", "kbd", rest.class]}
  >
    <span class="key">
      {key}
    </span>
  </div>
  {#if i < keys.length - 1}
    <span>+</span>
    <span></span>
  {/if}
{/each}

<style lang="scss">
  @use "$lib/styles/utils.scss" as *;

  $accent-color: var(--kbd-accent-color, C(accent));

  :global
  .titchy.kbd {
    display: inline-flex;
    flex-direction: row;
    background-color: $accent-color;
    padding-bottom: 2px;
    border-radius: 10px;

    &:active .key { transform: translateY(1px); }

    .key {
      transition-timing-function: ease-out;
      transition-duration: 100ms;
      padding: 0 1ch;
      transform: translateY(-2px);
      text-align: center;
      border-radius: 10px;
      border: 1px solid $accent-color;
      background-color: set-alpha($accent-color, 25%, true);
    }
  }
</style>
