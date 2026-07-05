import { PlayerEn, playersEnAC } from "./players-en-a-c";
import { playersEnDF } from "./players-en-d-f";
import { playersEnGI } from "./players-en-g-i";
import { playersEnJL } from "./players-en-j-l";

export { teamsEn } from "./teams-en";
export type { TeamEn } from "./teams-en";
export type { PlayerEn };

import { extraEn } from "@/data/extra/extra-en";

export const playersEn: Record<string, PlayerEn> = {
  ...playersEnAC,
  ...playersEnDF,
  ...playersEnGI,
  ...playersEnJL,
  ...extraEn,
};
