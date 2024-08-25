import {
	CEOEmployee,
	FOOD_EMPLOYEE_ID,
	FoodEmployee,
	ManagementEmployee,
	MARKETING_EMPLOYEE_ID,
	MarketingEmployee,
	MGMT_EMPLOYEE_ID,
	TRAINING_EMPLOYEE_ID,
	TrainingEmployee,
	WAITRESS_EMPLOYEE_ID,
	WaitressEmployee
} from "./employee_types";

export type EMPLOYEE_ENUM =
	| "MANAGEMENT"
	| "FOOD"
	| "MARKETING"
	| "WAITRESS"
	| "CEO"
	| "TRAINING";

// export type DRINK_NAME = (typeof DRINK_NAMES)[number];
// export type RECRUITER_NAME =
// 	(typeof RECRUITER_NAMES)[number];
// export type PRICER_NAME = (typeof PRICER_NAMES)[number];
// export type RED_NAME = (typeof RED_NAMES)[number];
// export type PINK_NAME = (typeof PINK_NAMES)[number];

// TODO: Implement the rest of the employees
export type EMPLOYEE_ID =
	| MGMT_EMPLOYEE_ID
	| FOOD_EMPLOYEE_ID
	| MARKETING_EMPLOYEE_ID
	| WAITRESS_EMPLOYEE_ID
	| TRAINING_EMPLOYEE_ID;

export type EmployeeType =
	| ManagementEmployee
	| FoodEmployee
	| MarketingEmployee
	| CEOEmployee
	| WaitressEmployee
	| TrainingEmployee;
