import { MANAGEMENT_NAME } from "./EmployeeNames";
import {
	FOOD_TYPE,
	ManagementEmployee
} from "./EmployeeTypes";

export enum COLOURS {
	BLACK = "#000000",
	DARK_GREEN = "#008000"
}

function createManagementEmployees(
	inData: {
		name: MANAGEMENT_NAME;
		capacity: number;
		notPaid?: boolean;
		oneOf?: boolean;
	}[]
): ManagementEmployee[] {
	return inData.map((data) => ({
		name: data.name,
		type: "MANAGEMENT",
		id: `mgmt_${data.capacity}`,
		colour: COLOURS.BLACK,
		capacity: data.capacity,
		paid: !data.notPaid,
		oneOf: data.oneOf,
		buildsInto: []
	}));
}

function createFoodEmployees(
	inData: { name: string; produces: FOOD_TYPE }[]
) {
	return inData.map((data) => ({
		name: data.name,
		type: "FOOD",
		id: `food_${data.produces}`,
		colour: COLOURS.DARK_GREEN,
		produces: data.produces,
		amountProduct: 0
	}));
}

