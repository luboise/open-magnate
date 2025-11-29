import { useEffect, useMemo, useState } from "react";
import { useDerivedGameState } from "../../../hooks/game/useDerivedGameState";
import useTurnPlanning from "../../../hooks/game/useTurnPlanning";
import ReserveDisplay from "../Reserve/ReserveDisplay";
import { EmployeeType, RecruitAction } from "magnate-core";

type Props = {
	employeeHiringIndex: number;
	onClose?: () => void | Promise<void>;
};

function HiringWindow({
	employeeHiringIndex,
	onClose
}: Props) {
	const { employees: myEmployees } = useDerivedGameState();

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

	function onHire(employeeType: EmployeeType) {
		const newHire: Omit<RecruitAction, "player"> = {
			employeeIndex: employeeHiringIndex,
			recruiting: employeeType,
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
