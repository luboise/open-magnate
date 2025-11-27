import "./ReserveDisplay.css";

import { HTMLAttributes } from "react";
import EmployeeCard from "../Employees/EmployeeCard";
import useFullGameState from "../../../hooks/game/useGameStateView";
import { Employee, EmployeeDepartment, EmployeeType } from "magnate-core";

interface ReserveDisplayProps
	extends HTMLAttributes<HTMLDivElement> {
	employeeFilter?: (employee: Employee) => boolean;
	onEmployeeClicked?: (
		employeeClicked: EmployeeType
	) => void;
}

function ReserveDisplay({
	employeeFilter,
	onEmployeeClicked,
	...args
}: ReserveDisplayProps) {

	const { gameState } = useFullGameState();

	if (!gameState) return <></>;

	const { cardReserve } = gameState;

	const employeeEntries = Object.entries(cardReserve).filter(
		([employeeType]) =>
			Employee.isValidType(employeeType) &&
			(!employeeFilter ||
				employeeFilter(Employee.fromType(employeeType)))
	);

	const employeeList: Array<
		[Employee | undefined, number]
	> = employeeEntries.map(([employeeType, quantity]) => {
		const valid = Employee.isValidType(employeeType);
		const newemployee = Employee.fromType(
			employeeType as EmployeeType
		);

		return [
			valid ? newemployee : undefined,
			valid ? quantity : NaN
		];
	});

	const departments: EmployeeDepartment[] = [
		"MANAGEMENT",
		"RECRUITMENT",
		"MARKETING",
		"FOOD",
		"DRINK",
		"WAITRESS"
	];

	const categoryArrays = departments.map((type) => {
		const filteredEmployees = employeeList.filter(
			([employee]) =>
				employee && employee.department === type
		);

		return filteredEmployees.map(
			([employee, _quantity]) => (
				<EmployeeCard
					employee={employee!}
					onClick={() => {
						if (
							!employee ||
							employee.department === "CEO"
						)
							return;

						onEmployeeClicked &&
							onEmployeeClicked(employee.employeeType);
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
