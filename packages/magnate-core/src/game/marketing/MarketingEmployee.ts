import { MarketingEmployeeType, MarketingType } from ".";
import {
	BaseEmployee,
	EmployeeCreationData
} from "../Employee";
import { EmployeeColour } from "../Employee/EmployeeColour";

export interface MarketingEmployee extends BaseEmployee {
	department: "MARKETING";
	employeeType: MarketingEmployeeType;
	colour: EmployeeColour.LIGHT_BLUE;
	marketingType: MarketingType;
}

export const MarketingEmployee = {
	create({
		name,
		employeeType,
		marketingType,
		notPaid = false
	}: EmployeeCreationData<MarketingEmployee>): MarketingEmployee {
		return {
			employeeType,
			name: name,
			department: "MARKETING",
			colour: EmployeeColour.LIGHT_BLUE,
			marketingType: marketingType,
			buildsInto: [],
			notPaid: notPaid
		};
	}
};
