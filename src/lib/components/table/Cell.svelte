<script lang="ts" generics="Datum extends object">
  import type { HTMLAttributes } from "svelte/elements";
  import type { TableHeader as H } from ".";
  import { Check, X } from "@lucide/svelte";

  type Header = H<Datum>;

  interface Props {
    self?:        HTMLDivElement;
    type?:        'head' | 'data';
    header:       Header;
    placeholder?: string;
    row:          number;
    col:          number;
    'row-length': number;
    'col-length': number;
  }

  type Conditional =
    | { datum?:never; key?:never;        }
    | { datum:Datum;  key:Header['key']; };

  let {
    self        = $bindable(),
    header,
    type        = 'data',
    placeholder = '---',
    datum,
    key,
    row, col,
    'row-length': rLen,
    'col-length': cLen,
    ...rest
  }: Props & Conditional & HTMLAttributes<HTMLDivElement> = $props();

  const R = $derived(row + 1);
  const C = $derived(col + 1);

  const value = $derived.by(() => {
    const val = datum?.[key as keyof Datum];
    if (header.transform)
      return header.transform(val)
    return val;
  });
</script>

<div
  {...rest}
  class={[
    "titchy", "cell", type, key ? `key-${key.toString()}` : undefined,

    `row-${R}`, R % 2 ? "row-odd" : "row-even",
    { "row-first":R === 1, "row-last":R === rLen },

    `col-${C}`, C % 2 ? "col-odd" : "col-even",
    { "col-first":C === 1, "col-last":C === cLen },
  ]}
  style:align-items={header.align}
  style:justify-content={header.justify}
>
  {#if type === 'head'}
    {#if header?.render?.head}
      {@render header.render.head(header, col)}
    {:else}
      {header.label}
    {/if}
  {:else if type === 'data'}
    {#if header?.render?.data}
      {@render header.render.data(header, datum, row, col)}
    {:else}
      {#if typeof value === 'boolean'}
        {@const Symbol = value ? Check : X}
        <Symbol class={value.toString()} />
      {:else}
        {value?.toLocaleString() ?? placeholder}
      {/if}
    {/if}
  {/if}
</div>

<style lang="scss">
  @use "$lib/styles/utils.scss" as *;

  $accent-color: var(--table-accent-color, C(accent));

  $min-width: var(--table-min-width, 350px);
  $cell-padding: var(--table-cell-padding, V(spacing-4));

  :global
  .titchy.cell {
    justify-content: center;
    padding: $cell-padding;
    border-bottom: 2px dashed set-alpha($accent-color, 15%);

    > svg.true  { color: C(success); }
    > svg.false { color: C(danger);  }

    &.head {
      background-color: set-alpha($accent-color, 10%);
      border-bottom: 2px solid set-alpha($accent-color, 10%);
      font-weight: bold;
    }

    &.row-last {
      border-bottom: none;
    }
  }
</style>
