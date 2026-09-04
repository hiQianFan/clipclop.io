import type { LocalizedShape } from "../config";
import zh from "./zh";
import enSource from "./en";

const en: LocalizedShape<typeof zh> = enSource;
export const changelog = { zh, en } as const;
