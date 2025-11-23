import "./ReserveDisplay.css";

import { HTMLAttributes } from "react";
import {
	EMPLOYEE_ENUM,
	EMPLOYEE_ID,
	EmployeeType
} from "../../../../../shared/employees/types";
import { useGameStateView } from "../../../hooks/game/useGameState";
import { Employee } from "../../../utils";
import EmployeeCard from "../Employees/EmployeeCard";

interface ReserveDisplayProps
	extends HTMLAttributes<HTMLDivElement> {
	employeeFilter?: (employee: EmployeeType) => boolean;
	onEmployeeClicked?: (
		employeeClicked: EMPLOYEE_ID
	) => void;
}

function ReserveDisplay({
	employeeFilter,
	onEmployeeClicked,
	...args
}: ReserveDisplayProps) {
	const { reserve } = useGameStateView();
	[];
	if (!reserve) return <></>;

	const employeeEntries = Object.entries(reserve).filter(
		([employeeId]) =>
			Employee.IsValidId(employeeId) &&
			(!employeeFilter ||
				employeeFilter(Employee.ById(employeeId)))
	);

	const employeeList: Array<
		[EmployeeType | undefined, number]
	> = employeeEntries.map(([employeeId, quantity]) => {
		const valid = Employee.IsValidId(employeeId);
		const newemployee = Employee.ById(
			employeeId as EMPLOYEE_ID
		);

		return [
			valid ? newemployee : undefined,
			valid ? quantity : NaN
		] as [EmployeeType | undefined, number];
	});

	const employeeTypes: EMPLOYEE_ENUM[] = [
		"MANAGEMENT",
		"RECRUITMENT",
		"MARKETING",
		"FOOD",
		"DRINK",
		"WAITRESS",
	];

	const categoryArrays = employeeTypes.map((type) => {
		const filteredEmployees = employeeList.filter(
			([employee]) =>
				employee && employee.type === type
		);

		return filteredEmployees.map(
			([employee, _quantity]) => (
				<EmployeeCard
					employee={employee!}
					onClick={() => {
						if (
							!employee ||
							employee.type === "CEO"
						)
							return;

						onEmployeeClicked &&
							onEmployeeClicked(employee.id);
					}}
				/>
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
