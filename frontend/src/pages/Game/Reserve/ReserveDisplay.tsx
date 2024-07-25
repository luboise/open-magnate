import { HTMLAttributes } from "react";
import { useGameState } from "../../../hooks/useGameState";
import {
	EmployeesById,
	IsValidEmployeeId
} from "../../../utils";
import EmployeeCard from "../EmployeeTree/EmployeeCard";

interface ReserveDisplayProps
	extends HTMLAttributes<HTMLDivElement> {}

function ReserveDisplay({ ...args }: ReserveDisplayProps) {
	const { reserve } = useGameState();

	if (!reserve) return <></>;

	return (
		<div className="game-reserve-display" {...args}>
			{...Object.entries<number>(reserve).map(
				([employeeId, quantity]) => {
					if (!IsValidEmployeeId(employeeId))
						return <></>;

					return (
						<EmployeeCard
							employee={
								EmployeesById[employeeId]
							}
						/>
					);
				}
			)}
		</div>
	);
}

export default ReserveDisplay;

