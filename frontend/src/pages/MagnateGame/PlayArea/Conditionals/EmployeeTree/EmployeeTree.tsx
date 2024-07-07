import { useGameState } from "../../../../../hooks/useGameState";
import EmployeeCard from "./EmployeeCard";

function EmployeeTree() {
	const { myEmployees } = useGameState();

	// const employees: Employee[] = useMemo(() => {
	// 	return playerData?.employees.map(
	// 		(employeeId): Employee => {
	// 			return employees;
	// 		}
	// 	);
	// });

	return (
		<div
			className="game-employee-tree-section"
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between"
			}}
		>
			<div className="game-employee-tree-content"></div>
			<div
				className="game-employee-tree-cards"
				style={{ display: "flex", height: "30%" }}
			>
				{...myEmployees.map((employee) => (
					<EmployeeCard employee={employee} />
				))}
			</div>
		</div>
	);
}

export default EmployeeTree;

