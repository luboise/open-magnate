import { HTMLAttributes } from "react";
import { EMPLOYEE_ID } from "../../../../../shared/EmployeeIDs";
import { useGameState } from "../../../hooks/useGameState";
import { EmployeesById } from "../../../utils";
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
					const converted =
						employeeId as EMPLOYEE_ID;
					return (
						<EmployeeCard
							employee={
								EmployeesById[converted]
							}
						/>
					);
				}
			)}
		</div>
	);
}

export default ReserveDisplay;

