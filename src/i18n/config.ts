export const locales = ["zh", "en"] as const;
export type Locale = typeof locales[number];

export type LocalizedShape<T> =
  T extends string ? string :
  T extends readonly (infer U)[] ? readonly LocalizedShape<U>[] :
  T extends object ? { [K in keyof T]: LocalizedShape<T[K]> } : T;
