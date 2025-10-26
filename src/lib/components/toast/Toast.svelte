<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { CircleCheck, CircleX, Info, Skull, TriangleAlert, X } from "@lucide/svelte";

  import { Button, type ToastOptions } from "..";

  interface Props {
    self?:    HTMLDivElement;
    options:  ToastOptions;
  }

  let {
    self = $bindable(),
    options,
    ...rest
  }: Props & HTMLAttributes<HTMLDivElement> = $props();

  const duration = 350;

  let status = $state<null | 'entering' | 'exiting'>();

  $effect.pre(() => {
    status = 'entering';

    setTimeout(() => {
      status = null;
    }, duration);

    setTimeout(() => {
      status = 'exiting';
    }, options.timeout! - duration);
  });

  const dismiss = () => {
    status = 'exiting';

    setTimeout(() => {
      self?.remove();
    }, duration);
  };
</script>

{#snippet symbol()}
  {@const Symbol = options.icon ??
      options.type === 'info'    ? Info
    : options.type === 'success' ? CircleCheck
    : options.type === 'warn'    ? TriangleAlert
    : options.type === 'error'   ? CircleX
    : options.type === 'danger'  ? Skull
    : null}

  {#if Symbol}
    <Symbol />
  {/if}
{/snippet}

<div
  bind:this={self}
  {...rest}
  class={["titchy", "toast", options.type, status, rest.class]}
  style="transition-duration: {duration}ms;{rest.style}"
>
  <div class="icon">
    {@render symbol()}
  </div>
  <div class="body">
    {#if options.title}
      <div class="title">
        <span>{options.title}</span>
      </div>
    {/if}
    {#if options.content}
      <div class="content">
        <span>{options.content}</span>
      </div>
    {/if}
  </div>
  <div class="sep"></div>
  <div class="actions">
    {#each options.actions as action}
      {@const Icon = action.icon}
      <Button
        variant="secondary"
        class={["action", { labeled:!!action.label }]}
        onclick={action.onclick}
      >
        <Icon />
        {action.label}
      </Button>
    {/each}
    {#if options.dismissible}
      <Button class="action" onclick={dismiss} variant="secondary">
        <X />
      </Button>
    {/if}
  </div>
</div>

<style lang="scss">
  @use "@/others/utils.scss" as *;

  $min-width: var(--toast-min-width, min(350px, 80dvw));
  $accent-color: var(--toast-accent-color, C(accent));
  $shadow-color: var(--toast-shadow-color, C(primary));
  $highlight-color: var(--toast-highlight-color, C(secondary));

  :global
  .titchy.toast {
    &.info    { --toast-accent-color: #{C(info)};    }
    &.success { --toast-accent-color: #{C(success)}; }
    &.warn    { --toast-accent-color: #{C(warn)};    }
    &.error   { --toast-accent-color: #{C(error)};   }
    &.danger  { --toast-accent-color: #{C(notice)};  }

    pointer-events: all;
    min-width: $min-width;
    overflow: hidden;

    flex-direction: row;
    align-items: center;
    gap: V(spacing-4);

    background: set-alpha($accent-color, 25%);
    padding: V(spacing-3);

    border: 1px solid $accent-color;
    border-radius: V(radius-1);

    backdrop-filter: blur(8px);
    box-shadow: 0 0 5px set-alpha($shadow-color, 50%);

    &.entering, &.exiting {
      $gap: var(--toaster-gap, V(spacing-4));

      @include height(0, 'all');
      padding: 0;
      opacity: 0;
      border: none;
      filter: blur(25px);
      margin-bottom: calc(-1 * $gap);
    }

    &.entering {
      position: absolute;
    }

    .icon {
      color: $accent-color;

      > svg {
        stroke-width: V(spacing-1);
      }
    }

    .body {
      justify-content: center;
      word-break: break-word;

      .title {
        color: $accent-color;
      }

      .content {
        font-size: V(text-s);
      }
    }

    .sep { flex: 1; }

    .actions {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: end;
      gap: V(spacing-2);

      .action {
        --button-accent-color: #{$highlight-color};

        @include size(unset, 'all');
        box-shadow: none;
        padding: V(spacing-1);

        &.labeled {
          padding: V(spacing-1) V(spacing-2);
        }

        > svg {
          @include size(17.5px, 'all');
          opacity: 0.75;
        }
      }
    }
  }
</style>
