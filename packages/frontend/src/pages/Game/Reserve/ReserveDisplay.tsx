import "./ReserveDisplay.css";

import {
	Employee,
	EmployeeId,
	EmployeeType,
} from "magnate-core/game";

import { HTMLAttributes } from "react";
import EmployeeCard from "../Employees/EmployeeCard";
import useFullGameState from "../../../hooks/game/useGameStateView";

interface ReserveDisplayProps
	extends HTMLAttributes<HTMLDivElement> {
	employeeFilter?: (employee: Employee) => boolean;
	onEmployeeClicked?: (
		employeeClicked: EmployeeId
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
	> = employeeEntries.map(([employeeId, quantity]) => {
		const valid = Employee.isValidType(employeeId);
		const newemployee = Employee.fromType(
			employeeId as EmployeeId
		);

		return [
			valid ? newemployee : undefined,
			valid ? quantity : NaN
		];
	});

	const employeeTypes: EmployeeType[] = [
		"MANAGEMENT",
		"RECRUITMENT",
		"MARKETING",
		"FOOD",
		"DRINK",
		"WAITRESS"
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
