export const MarketingTypes = [
	"BILLBOARD",
	"MAILBOX",
	"PLANE",
	"RADIO"
] as const;

export type MarketingType = (typeof MarketingTypes)[number];
