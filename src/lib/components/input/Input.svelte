<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";

  interface Props {
    self?: HTMLInputElement;
    type?: typeof ACCEPTED_TYPES[number] | 'search';
  }

  let {
    self  = $bindable(),
    value = $bindable(),
    type,
    disabled,
    ...rest
  }: Props & HTMLInputAttributes = $props();

  const ACCEPTED_TYPES = [
    'text',
    'email',
    'password',
    'tel',
    'number',
    'url',
  ] satisfies HTMLInputAttributes['type'][];
</script>

<input
  bind:this={self}
  bind:value
  {...rest}
  class={["titchy", "input", rest.class]}
  type={!ACCEPTED_TYPES.includes(type as any) ? 'text' : type}
  inputmode={
    rest.inputmode ??
      type === 'email'  ? 'email'
    : type === 'tel'    ? 'tel'
    : type === 'number' ? 'numeric'
    : type === 'url'    ? 'url'
    : type === 'search' ? 'search'
    : "text"
  }
  {disabled}
/>

<style lang="scss">
  @use "@/others/utils.scss" as *;

  $height: var(--input-height, 36px);
  $height-surplus: var(--input-height-surplus, 28px);
  $accent-color: var(--input-accent-color, C(accent));
  $highlight-color: var(--input-highlight-color, C(secondary));
  $shadow-color: var(--input-shadow-color, C(primary));

  $padding: calc(2 * (V(spacing-2)));

  :global
  .titchy.input {
    cursor: text;
    height: $height;

    padding: 0 $padding;
    font-size: V(text-s);

    color: set-alpha($highlight-color, 75%);
    background-color: set-alpha($accent-color, 10%);
    font-family: inherit;

    border: 2px solid set-alpha($accent-color, 30%);
    border-radius: V(radius-1);

    backdrop-filter: blur(8px);
    box-shadow: 0 0 5px set-alpha($shadow-color, 50%);

    &::placeholder {
      color: C(secondary, 15%);
    }

    &:is(textarea) {
      resize: vertical;
      min-height: calc($height * 2);
      max-height: calc($height * 8);
      line-height: 1.4;
      padding-top: $padding;
      padding-bottom: $padding;
      transition: all 200ms ease-out, height 0ms linear;

      overflow: auto;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0;
        background: transparent;
      }
    }

    &:hover:not(:disabled) {
      background-color: set-alpha($accent-color, 15%);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
</style>
