import { useGameState } from "../../../../../hooks/useGameState";

function EmployeeTree() {
	const { playerData } = useGameState();

	return (
		<div className="game-employee-tree-section">
			<div className="game-employee-tree-content"></div>
			<div className="game-employee-tree-cards"></div>
		</div>
	);
}

export default EmployeeTree;

