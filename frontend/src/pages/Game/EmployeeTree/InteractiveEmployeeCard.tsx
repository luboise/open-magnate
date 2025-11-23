import { HTMLAttributes } from "react";

import { EmployeeType } from "@shared/employees/types";
import EmployeeCard from "../Employees/EmployeeCard";

interface InteractiveEmployeeCardBaseProps
	extends HTMLAttributes<HTMLDivElement> {
	employee: EmployeeType;
}

type InteractiveEmployeeCardProps =
	InteractiveEmployeeCardBaseProps & {};

function InteractiveEmployeeCard({
	employee,
	...args
}: InteractiveEmployeeCardProps) {
	return (
		<>
			<EmployeeCard employee={employee} {...args} />
		</>
	);
}

export default InteractiveEmployeeCard;

