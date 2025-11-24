import { MarketingEmployee } from "./MarketingEmployee";

export * from "./MarketingTile";

export const MarketingTypes = [
	"BILLBOARD",
	"MAILBOX",
	"PLANE",
	"RADIO"
] as const;
export type MarketingType = (typeof MarketingTypes)[number];

const MarketingEmployeeTypes = [
	"market_1",
	"market_2",
	"market_3",
	"market_4"
] as const;
export type MarketingEmployeeType =
	(typeof MarketingEmployeeTypes)[number];

export const MarketingEmployees: Record<
	MarketingEmployeeType,
	MarketingEmployee
> = {
	market_1: MarketingEmployee.create({
		employeeType: "market_1",
		marketingType: "BILLBOARD",
		name: "Marketing Trainee",
		notPaid: true,
		buildsInto: ["market_2"]
	}),
	market_2: MarketingEmployee.create({
		employeeType: "market_2",
		marketingType: "MAILBOX",
		name: "Campaign Manager",
		buildsInto: ["market_3"]
	}),
	market_3: MarketingEmployee.create({
		employeeType: "market_3",
		marketingType: "PLANE",
		name: "Brand Manager",
		buildsInto: ["market_4"]
	}),
	market_4: MarketingEmployee.create({
		employeeType: "market_4",
		marketingType: "RADIO",
		name: "Brand Director",
		buildsInto: []
	})
} as const;
