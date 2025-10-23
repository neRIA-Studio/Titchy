<script lang="ts">
  import type { HTMLInputAttributes, MouseEventHandler } from "svelte/elements";
  import { blur } from "svelte/transition";
  import { Check, Clipboard, Copy, Eye, EyeOff, Hash, KeyRound, Link, Mail, Phone, Scissors, Search, Type, X, type Icon } from "@lucide/svelte";

  import { entries, values, type ValueOf } from "$lib/utils";
  import { Button } from ".";

  interface SideAction {
    func:             MouseEventHandler<HTMLButtonElement>;
    inheritsDisabled: boolean;
    active:           boolean;
    icon:             typeof Icon;
    activeIcon:       typeof Icon;
  }

  interface BuiltinSideActions {
    hidable?:   'none' | 'hover' | 'always';
    cuttable?:  'none' | 'hover' | 'always';
    copyable?:  'none' | 'hover' | 'always';
    /**🍝*/
    pastable?:  'none' | 'hover' | 'always';
    clearable?: 'none' | 'hover' | 'always';
  }

  interface Props {
    label?:                 string;
    type?:                  typeof ACCEPTED_TYPES[number] | 'search';
    icon?:                  boolean | typeof Icon;
    wrapped?:               boolean;
    'side-actions'?:        BuiltinSideActions;
    'custom-side-actions'?: (SideAction & { mode:ValueOf<BuiltinSideActions> })[];
    'actions-on-hover'?:    boolean;
  }

  const {
    label,
    type,
    disabled,
    icon,
    wrapped = !!icon,
    'side-actions': sideActions,
    'custom-side-actions': customSideActions,
    'actions-on-hover':actionsOnHover,
    ...rest
  }: Props & HTMLInputAttributes = $props();

  /* =============================== Constants ============================== */

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

  /* ================================ States ================================ */

  let inputElement = $state<HTMLInputElement | null>(null);

  let hidden  = $state<boolean>(type === 'password');
  let copied  = $state<boolean>(false);
  let cutted  = $state<boolean>(false); // I know it's just "cut"
  let pasted  = $state<boolean>(false);
  let cleared = $state<boolean>(false);

  let actionCount = $derived(
    Number(!!wrapped) * (
      values(sideActions ?? { })
        .filter(e => e !== 'none')
        .length
    )
  );

  /* =========================== Actions Functions ========================== */

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

  /* ============================ Actions Record ============================ */

  const builtinActionsRecord = $derived<Record<keyof BuiltinSideActions, SideAction>>({
    hidable:   { func: onHide,  active: hidden,  icon: EyeOff,    activeIcon: Eye,   inheritsDisabled: false },
    cuttable:  { func: onCut,   active: cutted,  icon: Scissors,  activeIcon: Check, inheritsDisabled: true  },
    copyable:  { func: onCopy,  active: copied,  icon: Copy,      activeIcon: Check, inheritsDisabled: false },
    pastable:  { func: onPaste, active: pasted,  icon: Clipboard, activeIcon: Check, inheritsDisabled: true  },
    clearable: { func: onClear, active: cleared, icon: X,         activeIcon: Check, inheritsDisabled: true  },
  });
</script>

{#snippet input()}
  <input
    bind:this={inputElement}
    {...rest}
    class={["titchy", "input", rest.class]}
    type={hidden ? "password" : type === 'password' && !hidden || !ACCEPTED_TYPES.includes(type as any) ? 'text' : type}
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

{#snippet action(action: SideAction, mode: ValueOf<BuiltinSideActions> = 'always')}
  {@const NormalIcon = action.icon}
  {@const ActiveIcon = action.activeIcon}

  <Button class={["action", mode]} variant="wrapper" onclick={action.func} disabled={action.inheritsDisabled && disabled}>
    {#if action.active}
      <div in:blur><ActiveIcon /></div>
    {:else}
      <div in:blur><NormalIcon /></div>
    {/if}
  </Button>
{/snippet}

{#snippet actions()}
  {@const alwaysActions = entries(sideActions ?? { }).filter(e => e[1] === 'always').map(e => e[0])}
  {@const hoverActions  = entries(sideActions ?? { }).filter(e => e[1] === 'hover' ).map(e => e[0])}
  {@const customAlways  = customSideActions?.filter(e => e.mode === 'always') ?? []}
  {@const customHover   = customSideActions?.filter(e => e.mode === 'hover' ) ?? []}

  <div
    class="actions"
    class:on-hover={actionsOnHover}
  >
    <!-- Always shown icons first. -->
    {#each alwaysActions as name}
      {@render action(builtinActionsRecord[name], 'always')}
    {/each}
    {#each customAlways as act}
      {@render action(act, act.mode)}
    {/each}
    <!-- Then ones that show on hover. -->
    {#each hoverActions as name}
      {@render action(builtinActionsRecord[name], 'hover')}
    {/each}
    {#each customHover as act}
      {@render action(act, act.mode)}
    {/each}
  </div>
{/snippet}

{#if wrapped}
  <div
    class={["titchy input-wrapper", { disabled, labeled:!!label }]}
    style="--action-count: {actionCount};--has-icon:{Number(!!icon)};"
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

    &:is(:hover, :focus-within)
    .actions .action.hover { opacity: 1; }

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

    .actions {
      position: absolute;
      right: calc(V(spacing-2) + 2px /*border*/);
      pointer-events: none;

      flex-direction: row-reverse;
      align-items: center;
      justify-content: center;
      gap: $action-padding;

      .action {
        align-items: center;
        justify-content: center;
        padding: $action-padding;
        pointer-events: all;

        &.hover { opacity: 0; }

        > div > svg {
          color: $accent-color;
          @include size($action-size);
          stroke-width: V(spacing-1);
        }
      }

    }

    .label {
      position: absolute;
      top: calc($height-surplus);
      left: calc($displacement-left + 2px);

      height: $icon-size;
      justify-content: center;
      transform: translateY(-100%);
      pointer-events: none;

      color: $accent-color;
      font-weight: bold;
    }
  }
</style>
