<script lang="ts">
  import { onMount, untrack, type Snippet } from "svelte";
  import type { HTMLAttributes, MouseEventHandler } from "svelte/elements";
  import { ChevronDown } from "@lucide/svelte";

  import { Button } from "../button";
  import { Popover } from "../popover";
  import { Option } from ".";

  interface Props {
    self?:         HTMLDivElement;
    active?:       boolean;
    value?:        string;
    label?:        string | Snippet;
    constrained?:  boolean;
    deselectable?: boolean;
    details?:      boolean | string;
    'copy-html'?:  boolean;
    'inherit-size'?: 'none' | 'width' | 'height' | 'both';
    // Temp
    texts?: { deselect:string, details:string };
  }

  let {
    self                        = $bindable(),
    active                      = $bindable(false),
    value                       = $bindable(""),
    label                       = "Select",
    constrained                 = true,
    deselectable                = false,
    details                     = false,
    'copy-html': copyHTML       = false,
    'inherit-size': inheritSize = "width",
    // Temp
    texts = { deselect:"Deselect", details:"Select an option" },
    ...rest
  }: Props & HTMLAttributes<HTMLDivElement> = $props();

  let selectedHTML    = $state<string>("");
  let selectedLabel   = $state<string>("");
  let selectedDetails = $state<string>("");
  let optionsDiv      = $state<HTMLDivElement>();

  let options = $derived.by<HTMLButtonElement[]>(() => {
    const opts: HTMLButtonElement[] = [];

    if (optionsDiv)
      for (const op of optionsDiv!.children) {
        const isOption = op.tagName === 'BUTTON' && op.classList.contains("option");
        const indolent = op.hasAttribute("data-indolent");

        if (isOption && !indolent)
          opts.push(op as HTMLButtonElement);
      }

    return opts;
  });

  $effect(() => {
    for (const op of options)
      op.onclick = onselect(op);
  });

  onMount(() => {
    for (const op of options) {
      const opVal = op.getAttribute("data-value");
      const init  = untrack(() => value);
        console.log({ opVal, init })

      if (opVal === init)
        op.onclick?.({ } as any);
    }
  });

  const resetSelection = () => {
    active          = false;
    selectedHTML    = "";
    selectedLabel   = "";
    selectedDetails = "";
    value           = "";
  };

  const onclick: MouseEventHandler<HTMLButtonElement> = e => {
    active = !active;

    if (deselectable && e.shiftKey)
      resetSelection();
  };

  const onselect = (op: HTMLButtonElement) => (e?: MouseEvent) => {
    if (e?.defaultPrevented)
      return;

    active          = false;
    selectedHTML    = op.innerHTML;
    selectedLabel   = op.getAttribute("data-label") || op.textContent || "";
    selectedDetails = op.getAttribute("data-description") || "";
    value           = op.getAttribute("data-value") || selectedLabel;
  };
</script>

{#snippet action(label: string, onclick: MouseEventHandler<HTMLButtonElement>)}
  <Option class="action" {onclick} indolent>
    {label}
  </Option>
{/snippet}

<div
  bind:this={self}
  role="listbox"
  {...rest}
  class={["titchy", "select", { active }, rest.class]}
>
  <Button class={["trigger", { constrained }]} scaling={false} {onclick}>
    <div class="content">
      {#if selectedHTML && copyHTML}
        {@html selectedHTML}
      {:else}
        <span class="label">
          {#if selectedLabel || value}
            {selectedLabel || value}
          {:else if typeof label === 'string'}
            {label}
          {:else}
            {@render label()}
          {/if}
        </span>
      {/if}
      {#if details}
        <span class="details">
          {value ? selectedDetails || label : typeof details === 'string' ? details : texts.details}
        </span>
      {/if}
    </div>
    <ChevronDown class="chevron" />
  </Button>

  <Popover bind:active parent={self} inherit-size={inheritSize}>
    <div bind:this={optionsDiv} class="options">
      {@render rest.children?.()}
    </div>
    {#if deselectable}
      <div class="options">
        {@render action(texts.deselect, resetSelection)}
      </div>
    {/if}
  </Popover>
</div>

<style lang="scss">
  @use "$lib/styles/utils.scss" as *;

  $accent-color: var(--select-accent-color, C(accent));
  $highlight-color: var(--select-highlight-color, C(secondary));

  $min-width: var(--select-min-width, 200px);
  $gap: var(--select-gap, V(spacing-2));

  :global
  .titchy.select {
    font-size: V(text-s);
    align-items: stretch;
    justify-content: stretch;

    svg { @include size(V(spacing-6)); }

    > .trigger {
      --button-accent-color: #{$accent-color};

      flex: 1;
      justify-content: space-between;
      padding: V(spacing-3) V(spacing-4);

      &.constrained { min-width: $min-width; }

      > .content {
        > .label {
          font-weight: bold;
        }

        > .details {
          color: set-alpha($highlight-color, 80%);
          font-size: V(text-xs);
        }
      }

      > svg.chevron { stroke-width: 4px; }
    }

    > .titchy.popover {
      > .options {
        max-height: 32dvh;
        overflow-y: auto;
        @include hide-scrollbar();

        padding: $gap;
        gap: $gap;
        background-color: C(primary);
        transform-origin: top center;

        border: 2px solid C(tertiary);
        border-radius: V(radius-1);

        > .label {
          align-items: center;

          color: set-alpha($accent-color, 60%);
          font-size: V(text-xs);

          padding: 0 $gap;
          font-weight: bold;

          &:first-child { padding-block-start: $gap; }
          &:last-child  { padding-block-end:   $gap; }
        }

        > .action {
          // align-items: center;
          color: set-alpha($accent-color);
          font-size: V(text-xs);
        }
      }
    }

    &.active {
      > .trigger {
        > svg.chevron {
          rotate: 90deg;
        }
      }
    }
  }
</style>
