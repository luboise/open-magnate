import "./TrainingWindow.css";

import { useGameStateView } from "../../../hooks/game/useGameState";
import EmployeeCard from "../Employees/EmployeeCard";

interface Props {
	employeeIndex: number;
	onClose: () => void | Promise<void>;
}

function TrainingWindow({ employeeIndex, onClose }: Props) {
	const { myEmployees } = useGameStateView();

	const trainable = myEmployees.filter(
		(e) => e.buildsInto.length > 0
	);

	return (
		<div id="training-window">
			{...trainable.map((t) => (
				<EmployeeCard employee={t} />
			))}
		</div>
	);
}

export default TrainingWindow;
