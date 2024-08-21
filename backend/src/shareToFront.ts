import { TURN_PROGRESS } from "@prisma/client";

// Enums
export {
	type DEMAND_TYPE,
	type MARKETING_TYPE,
	type TURN_PROGRESS
} from "@prisma/client";

// Models
export {
	type House,
	type MarketingCampaign
} from "@prisma/client";

export const TURN_PROGRESS_VALUES: TURN_PROGRESS[] =
	Object.values(TURN_PROGRESS);
