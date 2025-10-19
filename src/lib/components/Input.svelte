<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";

  interface Props { }

  const {
    type,
    ...rest
  }: Props & HTMLInputAttributes = $props();

  const ACCEPTED_TYPES:HTMLInputAttributes['type'][] = [
    'text',
    'email',
    'password',
    'tel',
    'number',
    //'search', // whore
    'url',
  ];
</script>

<input
  {...rest}
  type={ACCEPTED_TYPES.includes(type) ? type : "text"}
  class={["titchy", "input", rest.class]}
/>

<style lang="scss">
  @use "@/others/utils.scss" as *;

  $accent-color: var(--input-accent-color, C(accent));
  $shadow-color: var(--input-shadow-color, C(primary));

  :global
  .titchy.input {
    cursor: text;
    height: 36px;
    text-indent: V(spacing-3);
    padding-inline-end: V(spacing-3);
    font-size: smaller;

    color: C(secondary);
    background-color: set-alpha($accent-color, 10%);

    border: 2px solid set-alpha($accent-color, 30%);
    border-radius: V(radius-1);

    backdrop-filter: blur(8px);
    // filter: drop-shadow(0 0 5px $shadow-color);
    box-shadow: 0 0 5px $shadow-color;

    &::placeholder {
      color: C(secondary, 15%);
    }

    &:hover {
      background-color: set-alpha($accent-color, 15%);
    }
  }
</style>
