<script lang="ts" generics="Datum extends object">
  import type { HTMLAttributes } from "svelte/elements";

  import { Cell, type TableHeader as H } from ".";

  type Header = H<Datum>;

  interface Props {
    self?:     HTMLDivElement;
    headers:   Header[];
    data:      Datum[];
  }

  let {
    self        = $bindable(),
    headers,
    data        = [],
    ...rest
  }: Props & HTMLAttributes<HTMLDivElement> = $props();

  const keys = $derived(headers.map(h => h.key));
</script>

<div
  bind:this={self}
  {...rest}
  class={["titchy", "table", rest.class]}
>
  <div
    class="grid"
    style="grid-template-columns: {headers.map(h => h.size ?? "auto").join(" ")};"
  >
    <!-- Rendering the header -->
    {#each keys as f, c (c)}
      {@const header = headers[c]}
      <Cell
        {header}
        type="head"
        row={-1} col={c}
        row-length={data.length}
        col-length={keys.length}
      />
    {/each}
    <!-- Looping through each data entry and rendering each datum according to the corresponding header -->
    {#each data as datum, r (r)}
      {#each keys as key, c (c)}
        {@const header = headers[c]}
        <Cell
          {header}
          {datum} {key}
          type="data"
          row={r} col={c}
          row-length={data.length}
          col-length={keys.length}
        />
      {/each}
    {/each}
    <!-- I'm basically using these comments as separators, Svelte's '{#}' blocks look ugly -->
  </div>
</div>

<style lang="scss">
  @use "@/others/utils.scss" as *;

  $accent-color: var(--table-accent-color, C(accent));

  $min-width: var(--table-min-width, min(80dvw, 450px));
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
