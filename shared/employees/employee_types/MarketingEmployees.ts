import {
	BaseEmployee,
	MARKETING_TYPE
} from "../../../frontend/src/utils";
import {
	EMPLOYEE_COLOUR,
	EmployeeCreationData
} from "../EmployeeTypes";

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
	colour: EMPLOYEE_COLOUR.LIGHT_BLUE;
	marketingType: MARKETING_TYPE;
}

export function createMarketingEmployee({
	name,
	id,
	marketingType,
	notPaid = false
}: EmployeeCreationData<MarketingEmployee>): MarketingEmployee {
	return {
		id: id,
		name: name,
		type: "MARKETING",
		colour: EMPLOYEE_COLOUR.LIGHT_BLUE,
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
		notPaid: true,
		buildsInto: ["market_2"]
	}),
	market_2: createMarketingEmployee({
		id: "market_2",
		marketingType: "MAILBOX",
		name: "Campaign Manager",
		buildsInto: ["market_3"]
	}),
	market_3: createMarketingEmployee({
		id: "market_3",
		marketingType: "PLANE",
		name: "Brand Manager",
		buildsInto: ["market_4"]
	}),
	market_4: createMarketingEmployee({
		id: "market_4",
		marketingType: "RADIO",
		name: "Brand Director",
		buildsInto: []
	})
} as const;
