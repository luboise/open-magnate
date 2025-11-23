import {
	CEOEmployee,
	DrinkEmployee,
	DrinkEmployeeId,
	FoodEmployee,
	FoodEmployeeId,
	ManagementEmployee,
	ManagementEmployeeId,
	MarketingEmployee,
	MarketingEmployeeId,
	RecruitmentEmployee,
	RecruitmentEmployeeId,
	WaitressEmployeeId as WaitreeEmployeeId,
	WaitressEmployee
} from "./employee_types";

export type EmployeeType =
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
export type EmployeeId =
	| ManagementEmployeeId
	| FoodEmployeeId
	| DrinkEmployeeId
	| MarketingEmployeeId
	| WaitreeEmployeeId
	| RecruitmentEmployeeId;

export type Employee =
	| ManagementEmployee
	| DrinkEmployee
	| FoodEmployee
	| MarketingEmployee
	| CEOEmployee
	| WaitressEmployee
	| RecruitmentEmployee;
