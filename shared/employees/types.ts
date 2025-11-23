import {
	CEOEmployee,
	DRINK_EMPLOYEE_ID,
	DrinkEmployee,
	FOOD_EMPLOYEE_ID,
	FoodEmployee,
	MARKETING_EMPLOYEE_ID,
	MGMT_EMPLOYEE_ID,
	ManagementEmployee,
	MarketingEmployee,
	RECRUITMENT_EMPLOYEE_ID,
	RecruitmentEmployee,
	WAITRESS_EMPLOYEE_ID,
	WaitressEmployee
} from "./employee_types";

export type EMPLOYEE_ENUM =
	| "MANAGEMENT"
	| "FOOD"
	| "DRINK"
	| "MARKETING"
	| "WAITRESS"
	| "CEO"
	| "RECRUITMENT";

// export type PRICER_NAME = (typeof PRICER_NAMES)[number];
// export type RED_NAME = (typeof RED_NAMES)[number];
// export type PINK_NAME = (typeof PINK_NAMES)[number];

// TODO: Implement the rest of the employees
export type EMPLOYEE_ID =
	| MGMT_EMPLOYEE_ID
	| FOOD_EMPLOYEE_ID
	| DRINK_EMPLOYEE_ID
	| MARKETING_EMPLOYEE_ID
	| WAITRESS_EMPLOYEE_ID
	| RECRUITMENT_EMPLOYEE_ID;

export type EmployeeType =
	| ManagementEmployee
	| DrinkEmployee
	| FoodEmployee
	| MarketingEmployee
	| CEOEmployee
	| WaitressEmployee
	| RecruitmentEmployee;
