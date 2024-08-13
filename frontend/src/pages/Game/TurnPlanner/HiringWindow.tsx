import { useEffect, useMemo, useState } from "react";
import { EMPLOYEE_ID } from "../../../../../shared/EmployeeIDs";
import { useGameStateView } from "../../../hooks/game/useGameState";
import useTurnPlanning from "../../../hooks/game/useTurnPlanning";
import { RecruitAction } from "../../../utils";
import ReserveDisplay from "../Reserve/ReserveDisplay";

type Props = {
	employeeHiringIndex: number;
	onClose?: () => void | Promise<void>;
};

function HiringWindow({
	employeeHiringIndex,
	onClose
}: Props) {
	const { myEmployees } = useGameStateView();

	const { addAction } = useTurnPlanning();

	const employee = useMemo(() => {
		if (!myEmployees[employeeHiringIndex])
			throw new Error(
				"Invalid employee index: " +
					employeeHiringIndex
			);

		const employee = myEmployees[employeeHiringIndex];

		if (!employee.type)
			throw new Error("Employee type not set");

		if (
			employee.type !== "MANAGEMENT" &&
			employee.type !== "CEO"
		)
			throw new Error("Invalid employee type");

		return employee;
	}, [employeeHiringIndex, myEmployees]);

	const [hiresRemaining, setHiresRemaining] = useState(
		employee.type === "MANAGEMENT"
			? employee.capacity
			: 1
	);

	function onHire(employeeId: EMPLOYEE_ID) {
		const newHire: Omit<RecruitAction, "player"> = {
			employeeIndex: employeeHiringIndex,
			recruiting: employeeId,
			type: "RECRUIT" as const
		};

		addAction(newHire);
		setHiresRemaining(
			(previousHires) => previousHires - 1
		);
	}

	useEffect(() => {
		if (hiresRemaining <= 0) onClose && onClose();
	}, [hiresRemaining]);

	return (
		<>
			<ReserveDisplay
				employeeFilter={(e) => Boolean(e.notPaid)}
				onEmployeeClicked={onHire}
			/>
			Hires Remaining: {hiresRemaining}
		</>
	);
}

export default HiringWindow;
