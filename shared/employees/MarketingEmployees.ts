import {
	BaseEmployee,
	MarketingType
} from "../../frontend/src/utils";
import {
	COLOURS,
	createMarketingEmployee
} from "./Employees";

const MARKETING_EMPLOYEE_IDS = [
	"market_1",
	"market_2",
	"market_3",
	"market_4"
] as const;

export type MARKETING_EMPLOYEE_ID =
	(typeof MARKETING_EMPLOYEE_IDS)[number];

export interface MarketingEmployee extends BaseEmployee {
	type: "MARKETING";
	id: MARKETING_EMPLOYEE_ID;
	colour: COLOURS.LIGHT_BLUE;
	marketingType: MarketingType;
}

interface MarketingEmployeeCreationData {
	name: string;
	id: MARKETING_EMPLOYEE_ID;
	marketingType: MarketingType;
	notPaid?: boolean;
}

export function createMarketingEmployee({
	name,
	id,
	marketingType,
	notPaid = false
}: MarketingEmployeeCreationData): MarketingEmployee {
	return {
		id: id,
		name: name,
		type: "MARKETING",
		colour: COLOURS.LIGHT_BLUE,
		marketingType: marketingType,
		buildsInto: [],
		notPaid: notPaid
	};
}

export const MarketingEmployees: Record<
	MARKETING_EMPLOYEE_ID,
	MarketingEmployee
> = {
	market_1: createMarketingEmployee({
		id: "market_1",
		marketingType: "BILLBOARD",
		name: "Marketing Trainee",
		notPaid: true
	}),
	market_2: createMarketingEmployee({
		id: "market_2",
		marketingType: "MAILBOX",
		name: "Campaign Manager"
	}),
	market_3: createMarketingEmployee({
		id: "market_3",
		marketingType: "PLANE",
		name: "Brand Manager"
	}),
	market_4: createMarketingEmployee({
		id: "market_4",
		marketingType: "RADIO",
		name: "Brand Director"
	})
} as const;
