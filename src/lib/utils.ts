/* ================================== Types ================================= */

export type KeyOf<T> = keyof T;
export type ValueOf<T> = T[keyof T];

/* ================================ Functions =============================== */

export function isNullable(obj: unknown): obj is null | undefined {
  return obj === null || obj === undefined;
}

export function sort<T extends unknown[] | Record<number | string, unknown> | null>(obj: T): typeof obj {
  if (obj === null) return obj;
  return keys(obj).sort().reduce((r, k) => (r![k] = obj![k], r), { } as T);
}

export function keys<T extends object>(obj: T) {
  if (isNullable(obj)) return [];
  return Object.keys(obj) as (keyof T)[];
}

export function values<T extends object>(obj: T) {
  if (isNullable(obj)) return [];
  return Object.values(obj) as T[keyof T][];
}

export function entries<T extends object>(obj: T) {
  if (isNullable(obj)) return [];
  return Object.entries(obj) as [keyof T, T[keyof T]][];
}

export function define<T extends object, P extends object>(obj: T, props: P): T & P {
  return Object.defineProperties(obj, Object.getOwnPropertyDescriptors(props)) as T & P;
}
