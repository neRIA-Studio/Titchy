<script lang="ts">
  import { untrack, type Snippet } from "svelte";
  import type { HTMLAttributes, MouseEventHandler } from "svelte/elements";
  import { blur } from "svelte/transition";
  import { Check, Clipboard, Copy, Eye, EyeOff, Scissors, X, type Icon } from "@lucide/svelte";

  import { entries, values, type ValueOf } from "$lib/utils";
  import { Button } from "..";

  interface Props {
    children?:              Snippet;
    label?:                 string;
    icon?:                  typeof Icon;
    'side-actions'?:        BuiltinSideActions;
    'custom-side-actions'?: (SideAction & { mode:ActionMode })[];
    'actions-on-hover'?:    boolean;
  }

  type ActionMode = 'none' | 'hover' | 'always';

  interface SideAction {
    func:             MouseEventHandler<HTMLButtonElement>;
    inheritsDisabled: boolean;
    active:           boolean;
    icon:             typeof Icon;
    activeIcon:       typeof Icon;
  }

  interface BuiltinSideActions {
    hidable?:   ActionMode;
    cuttable?:  ActionMode;
    copyable?:  ActionMode;
    /**🍝*/
    pastable?:  ActionMode;
    clearable?: ActionMode;
  }

  let {
    children,
    label,
    icon,
    'side-actions': sideActions,
    'custom-side-actions': customSideActions,
    'actions-on-hover':actionsOnHover,
    ...rest
  }: Props & HTMLAttributes<HTMLDivElement> = $props();

  /* =============================== Constants ============================== */

  const FEEDBACK_DUR = 2000;

  /* ================================ States ================================ */

  let root    = $state<HTMLDivElement>();
  let input   = $state<HTMLInputElement | HTMLTextAreaElement>();
  let type    = $state<string | null>(null);

  let hidden  = $state<boolean>(false);
  let copied  = $state<boolean>(false);
  let cutted  = $state<boolean>(false); // I know it's just "cut"
  let pasted  = $state<boolean>(false);
  let cleared = $state<boolean>(false);

  let actionCount = $derived(
    values(sideActions ?? { })
      .filter(e => e !== 'none')
      .length
  );

  /* =========================== Actions Functions ========================== */

  const onHide = () => {
    if (!input || !type)
      return;

    hidden =! hidden;
    input.setAttribute('type', hidden ? 'password' : type === 'password' ? 'text' : type);
  };

  const onCut = async () => {
    setTimeout(() => cutted = false, FEEDBACK_DUR);
    const value = input?.value;

    if (value && input) {
      await navigator.clipboard.writeText(value);
      input.value = "";
      cutted = true;
    }
  };

  const onCopy = async () => {
    setTimeout(() => copied = false, FEEDBACK_DUR);
    const value = input?.value;

    if (value && input) {
      await navigator.clipboard.writeText(value);
      copied = true;
    }
  };

  const onPaste = async () => {
    setTimeout(() => pasted = false, FEEDBACK_DUR);
    const value = await navigator.clipboard.readText();

    if (value && input) {
      input.value = value;
      pasted = true;
    }
  };

  const onClear = () => {
    setTimeout(() => cleared = false, FEEDBACK_DUR);

    if (input && input.value) {
      input.value = "";
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

  $effect.pre(() => {
    if (!root)
      return;

    const findInput = () => {
      const found = root?.querySelector<HTMLInputElement | HTMLTextAreaElement>('input, textarea');

      if (found) {
        input  = found;
      }
    };

    const observer = new MutationObserver(findInput);
    observer.observe(root, { childList: true, subtree: true });

    findInput();

    return () => observer.disconnect();
  });

  $effect.pre(() => {
    if (input) {
      untrack(() => {
        type   = input?.type || null;
        hidden = input?.type === 'password';
      });
    }
  });
</script>

{#snippet symbol()}
  {@const Icon = icon}
  {#if Icon}
    <div class="symbol">
      <Icon />
    </div>
  {/if}
{/snippet}

{#snippet action(action: SideAction, mode: ValueOf<BuiltinSideActions> = 'always')}
  {@const NormalIcon = action.icon}
  {@const ActiveIcon = action.activeIcon}

  <Button class={["action", mode]} variant="wrapper" onclick={action.func} disabled={action.inheritsDisabled && input?.disabled}>
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

<div
  bind:this={root}
  {...rest}
  class={["titchy input-wrapper", { disabled:input?.disabled, labeled:!!label }, rest.class]}
  style="--action-count: {actionCount};--has-icon:{Number(!!icon)};{rest.style}"
>
  {@render children?.()}
  {#if icon}
    {@render symbol()}
  {/if}
  {@render actions()}
  {#if label}
    <div class="label">
      <span>
        {label}
      </span>
    </div>
  {/if}
</div>

<style lang="scss">
  @use "$lib/styles/utils.scss" as *;

  $height: var(--input-height, 36px);
  $height-surplus: var(--input-height-surplus, 28px);

  $accent-color: var(--input-accent-color, C(accent));
  $highlight-color: var(--input-highlight-color, C(secondary));

  $has-icon: var(--has-icon, 0);
  $icon-size: V(spacing-6);

  $action-size: V(spacing-5);
  $action-padding: V(spacing-1);
  $action-count: var(--action-count, 0);

  $padding: calc(2 * (V(spacing-2)));
  $displacement-inline-start: calc($padding + $has-icon * ($icon-size + 2 * $action-padding));
  $displacement-inline-end: calc($padding + $action-count * ($action-size + $action-padding * 2) + max(0, $action-count - 1) * ($action-padding));

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
        padding-block-start: $height-surplus;
        padding-inline-start: $padding;
        padding-inline-end: $padding;

        &:is(textarea) {
          min-height: calc($height * 2 + $height-surplus);
          max-height: calc($height * 8 + $height-surplus);
          padding-block-start: calc($height-surplus + $padding / 2);
        }
      }

      .symbol {
        inset-block-start: calc($height-surplus);
        transform: translateY(-100%);
      }

      .actions {
        inset-block-start: calc($height-surplus);
        transform: translateY(-100%);
      }
    }

    &:focus-within > * { z-index: 10; }

    .input {
      padding-inline-start: $displacement-inline-start;
      padding-inline-end: $displacement-inline-end;
    }

    &:is(:hover, :focus-within)
    .actions .action.hover { opacity: 1; }

    .symbol {
      position: absolute;
      inset-inline-start: calc(V(spacing-2) + 2px /*border*/ + $action-padding);

      color: $highlight-color;
      pointer-events: none;

      align-items: center;
      justify-content: center;

      > svg {
        @include size($icon-size);
        stroke-width: V(spacing-1);
      }
    }

    .actions {
      position: absolute;
      inset-inline-end:  calc(V(spacing-2) + 2px /*border*/);
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
        border-radius: V(radius-max);

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
      inset-block-start: calc($height-surplus);
      inset-inline-start: calc($displacement-inline-start + 2px);

      height: $icon-size;
      justify-content: center;
      transform: translateY(-100%);
      pointer-events: none;

      color: $accent-color;
      font-weight: bold;
    }
  }
</style>
