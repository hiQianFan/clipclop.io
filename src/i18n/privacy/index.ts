import type { LocalizedShape } from "../config";
import zh from "./zh";
import enSource from "./en";

const en: LocalizedShape<typeof zh> = enSource;
export const privacy = { zh, en } as const;
