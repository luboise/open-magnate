import {
	MARKETING_TYPE as PrismaMarketingType,
	TURN_PROGRESS as PrismaTurnProgress,
	TURN_PROGRESS as PrismaTurnProgressObject
} from "@prisma/client";

export type TURN_PROGRESS = PrismaTurnProgress;
export const TURN_PROGRESS_VALUES: TURN_PROGRESS[] =
	Object.values(PrismaTurnProgressObject);

export type MarketingType = PrismaMarketingType;
