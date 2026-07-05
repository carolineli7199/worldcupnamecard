import { PlayerDetail } from "@/lib/types";
import { detailsAC } from "./player-details-a-c";
import { detailsDF } from "./player-details-d-f";
import { detailsGI } from "./player-details-g-i";
import { detailsJL } from "./player-details-j-l";

import { extraDetails } from "./extra/extra-details";

export const playerDetails: Record<string, PlayerDetail> = {
  ...detailsAC,
  ...detailsDF,
  ...detailsGI,
  ...detailsJL,
  ...extraDetails,
};
