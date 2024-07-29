import { HTMLAttributes } from "react";
import { Employee } from "../../../../../shared/EmployeeTypes";
import EmployeeCard from "../Employees/EmployeeCard";

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
