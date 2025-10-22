<script lang="ts">
  import type { HTMLInputAttributes, MouseEventHandler } from "svelte/elements";
  import { Check, Clipboard, Copy, Eye, EyeOff, Hash, KeyRound, Link, Mail, Phone, Scissors, Search, Type, X, type Icon } from "@lucide/svelte";
  import { Button } from ".";
  import { blur } from "svelte/transition";

  interface Props {
    label?:              string;
    type?:               typeof ACCEPTED_TYPES[number] | 'search';
    icon?:               boolean | typeof Icon;
    wrapped?:            boolean;
    hidable?:            boolean;
    cuttable?:           boolean;
    copyable?:           boolean;
    /**🍝*/
    pastable?:           boolean;
    clearable?:          boolean;
    'actions-on-hover'?: boolean;
  }

  const {
    label,
    type,
    icon,
    disabled,
    wrapped = !!icon,
    hidable = type === 'password',
    cuttable,
    copyable,
    pastable,
    clearable,
    'actions-on-hover':actionsOnHover,
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

  const FEEDBACK_DUR = 2000;

  let inputElement = $state<HTMLInputElement | null>(null);

  let hidden  = $state<boolean>(type === 'password');
  let copied  = $state<boolean>(false);
  let cutted  = $state<boolean>(false); // I know it's just "cut"
  let pasted  = $state<boolean>(false);
  let cleared = $state<boolean>(false);

  let actionCount = $derived(
    Number(!!wrapped) * (
      Number(!!hidable)   +
      Number(!!cuttable)  +
      Number(!!copyable)  +
      Number(!!pastable)  +
      Number(!!clearable)
    )
  );

  const onHide = () => {
    hidden =! hidden;
  };

  const onCut = async () => {
    setTimeout(() => cutted = false, FEEDBACK_DUR);
    const value = inputElement?.value;

    if (value && inputElement) {
      await navigator.clipboard.writeText(value);
      inputElement.value = "";
      cutted = true;
    }
  };

  const onCopy = async () => {
    setTimeout(() => copied = false, FEEDBACK_DUR);
    const value = inputElement?.value;

    if (value && inputElement) {
      await navigator.clipboard.writeText(value);
      copied = true;
    }
  };

  const onPaste = async () => {
    setTimeout(() => pasted = false, FEEDBACK_DUR);
    const value = await navigator.clipboard.readText();

    if (value && inputElement) {
      inputElement.value = value;
      pasted = true;
    }
  };

  const onClear = () => {
    setTimeout(() => cleared = false, FEEDBACK_DUR);

    if (inputElement && inputElement.value) {
      inputElement.value = "";
      cleared = true;
    }
  };
</script>

{#snippet input()}
  <input
    bind:this={inputElement}
    {...rest}
    class={["titchy", "input", rest.class]}
    type={hidden ? "password" : type === 'password' && !hidden || !ACCEPTED_TYPES.includes(type as any) ? 'text' : type}
    inputmode={
        type === 'email'  ? 'email'
      : type === 'tel'    ? 'tel'
      : type === 'number' ? 'numeric'
      : type === 'url'    ? 'url'
      : type === 'search' ? 'search'
      : "text"
    }
    {disabled}
  />
{/snippet}

{#snippet symbol()}
  {@const Icon =
      icon && typeof icon !== 'boolean' ? icon
    : type === 'text'     ? Type
    : type === 'email'    ? Mail
    : type === 'password' ? KeyRound
    : type === 'tel'      ? Phone
    : type === 'number'   ? Hash
    : type === 'url'      ? Link
    : type === 'search'   ? Search
    : null}
  {#if Icon}
    <div class="symbol">
      <Icon />
    </div>
  {/if}
{/snippet}

{#snippet action(action: MouseEventHandler<HTMLButtonElement>, condition: boolean, active: boolean, Symbol: typeof Icon, Feedback: typeof Icon, inheritDisabled: boolean = false)}
  {#if condition}
    <Button variant="wrapper" onclick={action} disabled={inheritDisabled && disabled}>
      {#if active}
        <div in:blur><Feedback /></div>
      {:else}
        <div in:blur><Symbol /></div>
      {/if}
    </Button>
  {/if}
{/snippet}

{#snippet actions()}
  <div
    class="actions"
    class:on-hover={actionsOnHover}
  >
    {@render action(onHide,  !!hidable,   hidden,  EyeOff,    Eye  , false)}
    {@render action(onCut,   !!cuttable,  cutted,  Scissors,  Check, true )}
    {@render action(onCopy,  !!copyable,  copied,  Copy,      Check, false)}
    {@render action(onPaste, !!pastable,  pasted,  Clipboard, Check, true )}
    {@render action(onClear, !!clearable, cleared, X,         Check, true )}
  </div>
{/snippet}

{#if wrapped}
  <div
    class={["titchy input-wrapper", { disabled, labeled:!!label }]}
    style="--action-count: {actionCount};--has-icon:{Number(!!icon)};{rest.style}"
  >
    {@render input()}
    {#if icon}
      {@render symbol()}
    {/if}
    {@render actions()}
    {#if label?.length}
      <div class="label">
        <span>
          {label}
        </span>
      </div>
    {/if}
  </div>
{:else}
  {@render input()}
{/if}

<style lang="scss">
  @use "@/others/utils.scss" as *;

  $height: var(--input-height, 36px);
  $height-surplus: var(--input-height-surplus, 28px);
  $accent-color: var(--input-accent-color, C(accent));
  $highlight-color: var(--input-highlight-color, C(secondary));
  $shadow-color: var(--input-shadow-color, C(primary));

  $has-icon: var(--has-icon, 0);
  $icon-size: V(spacing-6);

  $action-size: V(spacing-5);
  $action-padding: V(spacing-1);
  $action-count: var(--action-count, 0);

  $padding: calc(2 * (V(spacing-2)));
  $displacement-left: calc($padding + $has-icon * ($icon-size + 2 * $action-padding));
  $displacement-right: calc($padding + $action-count * ($action-size + $action-padding * 2) + max(0, $action-count - 1) * ($action-padding));

  :global
  .titchy.input {
    cursor: text;
    height: $height;

    padding: 0;
    padding-left: $displacement-left;
    padding-right: $displacement-right;
    font-size: V(text-s);

    color: set-alpha($highlight-color, 75%);
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
    justify-content: center;

    &.disabled {
      .symbol {
        opacity: 0.35;
      }
    }

    &.labeled {
      .input {
        height: calc($height + $height-surplus);
        padding-top: $height-surplus;
        padding-left: $padding;
        padding-right: $padding;
      }

      .symbol {
        top: calc($height-surplus);
        transform: translateY(-100%);
      }

      .actions {
        top: calc($height-surplus);
        transform: translateY(-100%);
      }
    }

    .symbol {
      color: $highlight-color;
      pointer-events: none;

      position: absolute;
      left: calc(V(spacing-2) + 2px /*border*/ + $action-padding);

      align-items: center;
      justify-content: center;

      > svg {
        @include size($icon-size);
        stroke-width: V(spacing-1);
      }
    }

    &:is(:hover, :focus-within)
    .actions.on-hover { opacity: 1; }

    .actions {
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
          stroke-width: V(spacing-1);
        }
      }

      &.on-hover { opacity: 0; }
    }

    .label {
      position: absolute;
      top: calc($height-surplus);
      left: calc($displacement-left + 2px);

      height: $icon-size;
      justify-content: center;
      transform: translateY(-100%);

      color: $accent-color;
      font-weight: bold;
    }
  }
</style>
