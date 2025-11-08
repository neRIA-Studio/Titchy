import { mount, unmount, type ComponentProps } from "svelte";
import { BROWSER } from "esm-env";

import { Toast, type ToastOptions } from "..";
import { Toaster, type ToasterOptions } from ".";

const SELECTOR = 'section.titchy.toaster';

/**
 * Get a reference to the Toaster API, to either `add`, `remove`, or `clear` toast messages.
 * @param timeout The default timeout for toast messages for this Toaster ref. _(default: 5000)_
 * @returns Toaster API reference
 */
export function useToaster({ preload = true, timeout = 5_000 }: ToasterOptions = { }) {
  let toaster: Element | null = null;
  let toasts: ReturnType<typeof mount>[] = [];

  $effect(() => {
    if (BROWSER) {
      let element = document.body.querySelector(SELECTOR);

      if (!element) {
        mount(Toaster, { target:document.body });
        element = document.body.querySelector(SELECTOR);
      }

      toaster = element;
    }
  });

  $effect(() => {
    if (preload)
      api.add({ type:'info', timeout:0 });
  });

  const api = {
    /** Whether the Toaster API is ready for usage or not. */
    get ready()   { return !!toaster; },
    /** Array containing all Svelte mount refs to toast messages. */
    get toasts()  { return toasts;    },
    /** The HTML element for the Toaster. */
    get element() { return toaster;   },

    /**
     * Add a new toast message to the Toaster.
     * @param toastOptions Options to the toast message.
     * @returns A Svelte mount reference to toast message.
     */
    add(toastOptions: ToastOptions | string) {
      if (!toaster)
        return null;

      const options: ToastOptions = typeof toastOptions === 'string'
        ? { type:'info', content:toastOptions, dismissible:true }
        : toastOptions;

      const props: ComponentProps<typeof Toast> = {
        options: {
          ...options,
          timeout: options.timeout ?? timeout
        },
      };

      const toast = mount(Toast, { target:toaster, props });
      toasts.push(toast);

      // Remove the toast after its lifetime ends
      setTimeout(() => {
        this.remove(toast)
      }, props.options.timeout);

      return toast as ReturnType<typeof mount>;
    },

    /**
     * Ends the toast message's lifetime.
     * @param toast Svelte reference of to-be-removed toast message.
     */
    async remove(toast: ReturnType<typeof mount>) {
      const index = toasts.indexOf(toast);
      if (index !== -1) {
        toasts.splice(index, 1);
        await unmount(toast, { outro: true });
      }
    },

    /**
     * Clears all current toast messages.
     * @param simultaneous Whether to remove them all at the same time or one by one. _(default: false)_
     */
    async clear(simultaneous: boolean = false) {
      const copy = [...toasts];
      toasts = [];

      for (const toast of copy) {
        const promise = this.remove(toast);

        if (!simultaneous)
          await promise;
      }
    },
  };

  return api;
}
