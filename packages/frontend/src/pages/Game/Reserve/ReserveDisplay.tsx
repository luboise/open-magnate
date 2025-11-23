import "./ReserveDisplay.css";

import {
	Employee,
	EmployeeId,
	EmployeeType,
	getEmployeeById,
	isValidEmployeeId
} from "magnate-core/employees";
import { HTMLAttributes } from "react";
import { useGameStateView } from "../../../hooks/game/useGameState";
import EmployeeCard from "../Employees/EmployeeCard";

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
	const { reserve } = useGameStateView();
	[];
	if (!reserve) return <></>;

	const employeeEntries = Object.entries(reserve).filter(
		([employeeId]) =>
			isValidEmployeeId(employeeId) &&
			(!employeeFilter ||
				employeeFilter(getEmployeeById(employeeId)))
	);

	const employeeList: Array<
		[Employee | undefined, number]
	> = employeeEntries.map(([employeeId, quantity]) => {
		const valid = isValidEmployeeId(employeeId);
		const newemployee = getEmployeeById(
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

