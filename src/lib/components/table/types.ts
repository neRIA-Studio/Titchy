import type { CSS, ValueOf } from "$lib/utils";
import type { Snippet } from "svelte";

export type TablePlacement =
  | "start"
  | "center"
  | "end";

export type TableSizing =
  | 'auto'
  | 'min-content'
  | 'max-content'
  | `minmax(${string})`
  | `${number}${CSS.Units.Length | CSS.Units.Frac}`;

export type TableHeader<D extends object> = {
  key?:       keyof D | (string & { });
  label:      string;
  size?:      TableSizing;
  align?:     TablePlacement;
  justify?:   TablePlacement;
  transform?: (value: ValueOf<D> | undefined) => any;

  render?: {
    head?: Snippet<[TableHeader<D>, number]>;
    data?: Snippet<[TableHeader<D>, D | undefined, number, number]>;
  };
};
