import type { LocalizedShape } from "../config";
import zh from "./zh";
import enSource from "./en";

const en: LocalizedShape<typeof zh> = enSource;
export const home = { zh, en } as const;
