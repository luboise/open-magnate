import "./ReserveDisplay.css";

import { HTMLAttributes } from "react";
import EmployeeCard from "../Employees/EmployeeCard";
import useGameStateView from "../../../hooks/game/useGameStateView";
import { Employee, EmployeeType, EmployeeDepartment } from "magnate-core";

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

	const { gameState } = useGameStateView();

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

	const reserveIsEmpty: boolean = 0 === categoryArrays.reduce((acc, cat) => {
		return acc + cat.length
	}, 0);

	return (
		<div className="game-reserve-display" {...args}>
			{reserveIsEmpty ? (<h3>No employees available to display.</h3>) : (
				categoryArrays.map((category, i) => (
					<div className="game-reserve-display-row" key={`row-${i}`}>
						{...category}
					</div>
				))
			)
			}
		</div>
	);
}

export default ReserveDisplay;
