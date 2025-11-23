import { EmployeeId } from "../../employees/types";

export const DEFAULT_EMPLOYEE_ARRAY: (
	| EmployeeId
	| "CEO"
)[] = ["CEO"] as const;

export const DEFAULT_SERIALISED_EMPLOYEE_STRING =
	"0[X,X,X]";
