<script lang="ts" generics="Datum extends object">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  import { keys } from "@/lib/utils";

  interface Props {
    self?:        HTMLDivElement;
    template?:    string;
    orientation?: 'columns' | 'rows';
    headers:      Header;
    data:         Datum[];
  }

  type Header = {
    [K in keyof Datum | (string & {})]: {
      label:   string;
      render?: Snippet<[Datum, number, number]>;
    };
  };

  let {
    self        = $bindable(),
    headers,
    data        = [],
    template,
    orientation = 'columns',
    ...rest
  }: Props & HTMLAttributes<HTMLDivElement> = $props();

  const hKeys = $derived(keys(headers));
</script>

<!-- TODO: SIMPLIFY THAT MASSIVE PIECE OF SHIT -->

{#snippet cell(type: 'head' | 'data', datum: string | Datum, field: keyof Header, render: Header[string]['render'], r: number, c: number)}
  {@const R = r + 1}
  {@const C = c + 1}

  <div
    class={[
      "cell", type, `f-${field.toString()}`,

      `row-${R}`, R % 2 ? "row-odd" : "row-even",
      { 'row-first':R === 1, 'row-last':R === data.length  },

      `col-${C}`, C % 2 ? "col-odd" : "col-even",
      { 'col-first':C === 1, 'col-last':C === hKeys.length },
    ]}
  >
    {#if render && typeof datum !== 'string'}
      {@render render(datum, r, c)}
    {:else}
      {(typeof datum === 'string' ? datum : datum[field as keyof Datum]) ?? "---"}
    {/if}
  </div>
{/snippet}

<div
  bind:this={self}
  {...rest}
  class={["titchy", "table", rest.class]}
>
  <div
    class="grid"
    style="grid-template-{orientation}: {template ?? `repeat(${hKeys.length}, auto)`};"
  >
    <!-- Rendering the header -->
    {#each hKeys as h, c (c)}
      {@render cell('head', headers[h].label, h, undefined, -1, c)}
    {/each}
    <!-- Looping through each data entry and rendering each datum according to the corresponding header -->
    {#each data as datum, r (r)}
      {#each hKeys as h, c (c)}
        {@render cell('data', datum, h, headers[h].render, r, c)}
      {/each}
    {/each}
    <!-- I'm basically using these comments as separators, Svelte's '{#}' blocks look ugly -->
  </div>
</div>

<style lang="scss">
  @use "@/others/utils.scss" as *;

  $accent-color: var(--table-accent-color, C(accent));

  $min-width: var(--table-min-width, 350px);
  $cell-padding: var(--table-cell-padding, V(spacing-4));

  :global
  .titchy.table {
    min-width: $min-width;
    align-items: stretch;

    overflow: hidden;
    border: 2px solid set-alpha($accent-color, 20%);
    border-radius: 10px;

    .pager { border: none; border-radius: 0; }

    .grid {
      flex: 1;
      display: grid;

      .cell {
        padding: $cell-padding;

        &.head {
          background-color: set-alpha($accent-color, 10%);
          border-bottom: 2px solid set-alpha($accent-color, 10%);
          font-weight: bold;
        }

        &.row-last {
          border-bottom: none;
        }
      }
    }
  }
</style>
