import { HTMLAttributes } from "react";

import EmployeeCard from "../Employees/EmployeeCard";
import { Employee } from "magnate-core/game";

interface InteractiveEmployeeCardBaseProps
	extends HTMLAttributes<HTMLDivElement> {
	employee: Employee;
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
