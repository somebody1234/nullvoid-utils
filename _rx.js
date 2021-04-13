import { pub } from './_.js';

export const DATA = Symbol('data');

export function rx(obj, base=obj) {
  const data = base[DATA] = Object.create(null);
  for (const key in obj) {
    data[key] = obj[key];
    Object.defineProperty(base, key, {
      enumerable: true,
      configurable: true,
      get() { return data[key]; },
      set(val) { pub(base, key, data[key] = val); }
    });
  }
  return base;
}
