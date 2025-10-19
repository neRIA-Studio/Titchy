<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  import { Check, Clipboard, Copy, Eye, EyeOff, Hash, KeyRound, Link, Mail, Phone, TextCursor, type Icon } from "@lucide/svelte";
  import { Button } from ".";
  import { blur } from "svelte/transition";

  interface Props {
    type?: (typeof ACCEPTED_TYPES)[number];
    icon?: boolean | typeof Icon;
    wrapped?: boolean;
    hidable?: boolean;
    copyable?: boolean;
    /**🍝*/
    pastable?: boolean;
  }

  const {
    type,
    icon,
    wrapped = !!icon,
    hidable = type === 'password',
    copyable,
    pastable,
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
    //'search', // whore
  ] satisfies HTMLInputAttributes['type'][];

  let inputElement = $state<HTMLInputElement | null>(null);

  let hidden = $state<boolean>(type === 'password');
  let copied = $state<boolean>(false);
  let pasted = $state<boolean>(false);

  const onHide = () => {
    hidden =! hidden;
  };

  const onCopy = async () => {
    setTimeout(() => copied = false, 2000);
    const value = inputElement?.value;

    if (value && inputElement) {
      await navigator.clipboard.writeText(value);
      copied = true;
    }
  };

  const onPaste = async () => {
    setTimeout(() => pasted = false, 2000);
    const value = await navigator.clipboard.readText();

    if (value && inputElement) {
      inputElement.value = value;
      pasted = true;
    }
  };
</script>

{#snippet input()}
  <input
    bind:this={inputElement}
    {...rest}
    style="--action-count: {Number(!!wrapped) * (Number(!!hidable) + Number(!!copyable) + Number(!!pastable))};--has-icon:{Number(!!icon)};{rest.style}"
    type={hidden ? "password" : type === 'password' && !hidden || !ACCEPTED_TYPES.includes(type!) ? "text" : type}
    class={["titchy", "input", rest.class]}
    {disabled}
  />
{/snippet}

{#snippet symbol()}
  {@const Symbol = icon && typeof icon !== 'boolean' ? icon
    : type === 'text'     ? TextCursor
    : type === 'email'    ? Mail
    : type === 'password' ? KeyRound
    : type === 'tel'      ? Phone
    : type === 'number'   ? Hash
    : type === 'url'      ? Link
    : null
  }
  {#if Symbol}
    <div class="symbol">
      <Symbol />
    </div>
  {/if}
{/snippet}

{#snippet actions()}
  <div class="actions">
    {#if hidable}
      <Button variant="wrapper" onclick={onHide}>
        {#if hidden}
          <div in:blur><EyeOff /></div>
        {:else}
          <div in:blur><Eye /></div>
        {/if}
      </Button>
    {/if}
    {#if copyable}
      <Button variant="wrapper" onclick={onCopy}>
        {#if copied}
          <div in:blur><Check /></div>
        {:else}
          <div in:blur><Copy /></div>
        {/if}
      </Button>
    {/if}
    {#if pastable}
      <Button variant="wrapper" onclick={onPaste} {disabled}>
        {#if pasted}
          <div in:blur><Check /></div>
        {:else}
          <div in:blur><Clipboard /></div>
        {/if}
      </Button>
    {/if}
  </div>
{/snippet}

{#if wrapped}
  <div class={["titchy input-wrapper", { disabled }]}>
    {@render input()}
    {#if icon}
      {@render symbol()}
    {/if}
    {@render actions()}
  </div>
{:else}
  {@render input()}
{/if}

<style lang="scss">
  @use "@/others/utils.scss" as *;

  $accent-color: var(--input-accent-color, C(accent));
  $highlight-color: var(--input-highlight-color, C(secondary));
  $shadow-color: var(--input-shadow-color, C(primary));

  $has-icon: var(--has-icon, 0);
  $icon-size: V(spacing-6);
  $action-size: V(spacing-5);
  $action-padding: V(spacing-1);
  $action-count: var(--action-count, 0);
  $padding: calc(2 * (V(spacing-2)));


  :global
  .titchy.input {
    cursor: text;
    height: 36px;

    padding: 0;
    padding-left: calc($padding + $has-icon * $icon-size);
    padding-right: calc($padding + $action-count * ($action-size + $action-padding * 2) + ($action-count - 1) * ($action-padding));
    font-size: V(text-s);

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

    &:hover:not(:disabled) {
      background-color: set-alpha($accent-color, 15%);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }

  :global
  .titchy.input-wrapper {
    &.disabled {
      .symbol {
        opacity: 0.35;
      }
    }

    .symbol {
      @include height(100%, 'all');

      color: $highlight-color;
      pointer-events: none;

      position: absolute;
      left: calc(V(spacing-2) + 2px /*border*/);

      align-items: center;
      justify-content: center;

      > svg {
        @include size($icon-size);
      }
    }

    .actions {
      @include height(100%, 'all');

      position: absolute;
      right: calc(V(spacing-2) + 2px /*border*/);

      flex-direction: row-reverse;
      align-items: center;
      justify-content: center;
      gap: $action-padding;

      > button {
        align-items: center;
        justify-content: center;
        padding: $action-padding;

        > div > svg {
          color: $accent-color;
          @include size($action-size);
          stroke-width: 3px;
        }
      }
    }
  }
</style>
