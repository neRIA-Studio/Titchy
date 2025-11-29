<script lang="ts">
  import type { HTMLTextareaAttributes } from "svelte/elements";

  interface Props {
    self?: HTMLTextAreaElement;
  }

  let {
    self  = $bindable(),
    value = $bindable(),
    disabled,
    ...rest
  }: Props & HTMLTextareaAttributes = $props();
</script>

<textarea
  bind:this={self}
  bind:value
  {...rest}
  class={["titchy", "textarea", "input", rest.class]}
  {disabled}
></textarea>

<style lang="scss">
  @use "./Input.scss";
</style>
