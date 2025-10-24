import type { MouseEventHandler } from "svelte/elements";
import type { Icon } from "@lucide/svelte";

export interface ToastAction {
  icon?:   typeof Icon;
  label?:  string;
  onclick: MouseEventHandler<HTMLButtonElement>;
}

export interface ToastOptions {
  type:         'info' | 'success' | 'warn' | 'danger' | 'error';
  title?:       string;
  content?:     string | string[];
  icon?:        typeof Icon;
  timeout?:     number;
  dismissible?: boolean;
  actions?:     ToastAction[];
};

export interface ToasterOptions {
  timeout?: number;
};
