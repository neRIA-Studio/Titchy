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
  @use "./Input.scss";
</style>
