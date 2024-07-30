import "./ReserveDisplay.css";

import { HTMLAttributes } from "react";
import { EMPLOYEE_ID } from "../../../../../shared/EmployeeIDs";
import { Employee } from "../../../../../shared/EmployeeTypes";
import { useGameState } from "../../../hooks/game/useGameState";
import {
	EmployeesById,
	IsValidEmployeeId
} from "../../../utils";
import EmployeeCard from "../Employees/EmployeeCard";

interface ReserveDisplayProps
	extends HTMLAttributes<HTMLDivElement> {
	employeeFilter?: (employee: Employee) => boolean;
}

function ReserveDisplay({
	employeeFilter,
	...args
}: ReserveDisplayProps) {
	const { reserve } = useGameState();

	if (!reserve) return <></>;

	const employeeEntries = Object.entries(reserve).filter(
		([employeeId]) =>
			IsValidEmployeeId(employeeId) &&
			(!employeeFilter ||
				employeeFilter(EmployeesById[employeeId]))
	);

	const employeeList: Array<
		[Employee | undefined, number]
	> = employeeEntries.map(([employeeId, quantity]) => {
		const valid = IsValidEmployeeId(employeeId);
		const newemployee =
			EmployeesById[employeeId as EMPLOYEE_ID];

		return [
			valid ? newemployee : undefined,
			valid ? quantity : NaN
		] as [Employee | undefined, number];
	});

	const employeeTypes = ["MANAGEMENT", "FOOD"];

	const categoryArrays = employeeTypes.map((type) => {
		const filteredEmployees = employeeList.filter(
			([employee]) =>
				employee && employee.type === type
		);

		return filteredEmployees.map(
			([employee, quantity]) => (
				<EmployeeCard employee={employee!} />
			)
		);
	});

	return (
		<div className="game-reserve-display" {...args}>
			{...categoryArrays.map((category) => (
				<div className="game-reserve-display-row">
					{...category}
				</div>
			))}
		</div>
	);
}

export default ReserveDisplay;
