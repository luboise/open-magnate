import { MarketingEmployeeType } from "../..";
import { DrinkEmployeeType } from "../../demand/DrinkEmployee";
import { FoodEmployeeType } from "../../demand/FoodEmployee";
import { ManagementEmployeeType } from "./ManagementEmployees";
import { RecruitmentEmployeeType } from "./RecruitmentEmployees";
import { WaitressEmployeeType } from "./WaitressEmployees";

export * from "../../demand/DrinkEmployee";
export * from "./CEOEmployees";
export * from "./ManagementEmployees";
export * from "./RecruitmentEmployees";
// export type PRICER_NAME = (typeof PRICER_NAMES)[number];
// export type RED_NAME = (typeof RED_NAMES)[number];
// export type PINK_NAME = (typeof PINK_NAMES)[number];
// TODO: Implement the rest of the employees

export type EmployeeType =
	| ManagementEmployeeType
	| FoodEmployeeType
	| DrinkEmployeeType
	| MarketingEmployeeType
	| WaitressEmployeeType
	| RecruitmentEmployeeType;

export * from "./WaitressEmployees";

// TODO: Implement these later
// const PRICER_NAMES = [
// 	"Pricing Manager",
// 	"Luxuries Manager",
// 	"Discount Manager"
// ] as const;
// const RED_NAMES = [
// 	"Local Manager",
// 	"Regional Manager"
// ] as const;
// const PINK_NAMES = ["Waitress", "CEO"] as const;
