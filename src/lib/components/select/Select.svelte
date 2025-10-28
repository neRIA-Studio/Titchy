<script lang="ts">
  import type { HTMLAttributes, MouseEventHandler } from "svelte/elements";
  import { slide } from "svelte/transition";
  import { ChevronDown } from "@lucide/svelte";

  import { Button } from "../button";
  import { Option } from ".";

  interface Props {
    self?:         HTMLDivElement;
    active?:       boolean;
    value?:        string;
    title?:        string;
    deselectable?: boolean;
    details?:      boolean | string;
  }

  let {
    self         = $bindable(),
    active       = $bindable(true),
    value        = $bindable(""),
    title        = "Select",
    deselectable = false,
    details      = false,
    ...rest
  }: Props & HTMLAttributes<HTMLDivElement> = $props();

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

  const resetSelection = () => {
    active          = false;
    selectedLabel   = "";
    selectedDetails = "";
    value           = "";
  };

  const onclick: MouseEventHandler<HTMLButtonElement> = e => {
    active = !active;

    if (deselectable && e.shiftKey)
      resetSelection();
  };

  const onselect = (op: HTMLButtonElement) => (e: MouseEvent) => {
    if (e.defaultPrevented)
      return;

    active          = false;
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
  <Button class="trigger" scaling={false} {onclick}>
    <div class="text">
      <span class="title">
        {selectedLabel || value || title}
      </span>
      {#if details}
        <span class="details">
          {value ? selectedDetails || title : typeof details === 'string' ? details : "Select an option"}
        </span>
      {/if}
    </div>
    <ChevronDown class="chevron" />
  </Button>
  {#if active}
    <div class="options-container" transition:slide={{ axis: "y" }}>
      <div bind:this={optionsDiv} class="options">
        {@render rest.children?.()}
      </div>
      {#if deselectable}
        <div class="options">
          {@render action("Deselect", resetSelection)}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style lang="scss">
  @use "@/others/utils.scss" as *;

  $accent-color: var(--select-accent-color, C(accent));
  $highlight-color: var(--select-highlight-color, C(secondary));

  $min-width: var(--select-min-width, 200px);
  $gap: var(--select-gap, V(spacing-2));

  :global
  .titchy.select {
    font-size: V(text-s);
    align-items: stretch;
    justify-content: stretch;

    > button.trigger {
    --button-accent-color: #{$accent-color};

      flex: 1;
      min-width: $min-width;
      justify-content: space-between;
      padding: V(spacing-3) V(spacing-4);

      > div.text {
        > span.title {
          font-weight: bold;
        }

        > span.details {
          color: set-alpha($highlight-color, 80%);
          font-size: V(text-xs);
        }
      }

      > svg.chevron {
        @include size(V(spacing-5));
        stroke-width: 4px;
      }
    }

    > div.options-container {
      position: absolute;
      top: 100%;
      z-index: 1;

      @include width(100%, 'all');
      gap: $gap;
      padding: $gap 0;

      > div.options {
        max-height: 32dvh;
        overflow-y: auto;
        @include hide-scrollbar();

        padding: $gap;
        gap: $gap;
        background-color: C(primary);
        transform-origin: top center;

        border: 2px solid C(tertiary);
        border-radius: V(radius-1);

        > label.label {
          align-items: center;

          color: set-alpha($highlight-color, 60%);
          font-size: V(text-xs);

          padding: 0 $gap;
          font-weight: bold;

          &:first-child { padding-top:    $gap; }
          &:last-child  { padding-bottom: $gap; }
        }

        > button.action {
          // align-items: center;
          font-size: V(text-xs);
        }
      }
    }

    &.active {
      > button.trigger {
        > svg.chevron {
          rotate: 90deg;
        }
      }
    }
  }
</style>
