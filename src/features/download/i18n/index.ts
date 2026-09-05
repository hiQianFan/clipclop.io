import type { LocalizedShape } from "../../../i18n/config";
import zh from "./zh";
import enSource from "./en";

const en: LocalizedShape<typeof zh> = enSource;
export const download = { zh, en } as const;
