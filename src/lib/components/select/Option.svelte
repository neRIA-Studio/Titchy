<script lang="ts">
  import type { ComponentProps } from "svelte";
  import { Button } from "../button";

  interface Props {
    value?:    string;
    label?:    string;
    details?:  string;
    indolent?: undefined | true;
  }

  let {
    self     = $bindable(),
    value    = "",
    label    = "",
    details  = "",
    indolent = undefined,
    ...rest
  }: Props & ComponentProps<typeof Button> = $props();
</script>

<Button
  bind:self
  variant="wrapper"
  scaling={false}
  data-value={value}
  data-label={label}
  data-description={details}
  data-indolent={indolent}
  role="option"
  {...rest}
  class={["option", rest.class]}
>
  {#if rest.children}
    {@render rest.children()}
  {:else}
    {label}
    {#if details}
      <span class="description">
        {details}
      </span>
    {/if}
  {/if}
</Button>

<style lang="scss">
  @use "@/others/utils.scss" as *;

  $highlight-color: var(--option-highlight-color, C(secondary));

  :global
  .titchy.button.button.option {
    color: set-alpha($highlight-color, 90%);
    padding: V(spacing-4);
    border-radius: calc(V(radius-1) - V(spacing-2));

    &:hover { background-color: set-alpha($highlight-color, 5%); }

    .description {
      font-size: V(text-xs);
      color: set-alpha($highlight-color, 50%);
      margin-top: V(spacing-1);
    }
  }
</style>
