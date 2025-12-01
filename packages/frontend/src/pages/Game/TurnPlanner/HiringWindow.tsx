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

		if (!employee.department)
			throw new Error("Employee type not set");

		if (
			employee.department !== "RECRUITMENT" &&
			employee.department !== "CEO"
		)
			throw new Error("Invalid employee type");

		return employee;
	}, [employeeHiringIndex, myEmployees]);

	// 1 because CEO's only have a single hire
	const [hiresRemaining, setHiresRemaining] = useState(
		employee.department === "RECRUITMENT"
			? employee.hiringSlots
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
			<p>Hires Remaining: {hiresRemaining}</p>
			<ReserveDisplay
				employeeFilter={(e) => Boolean(e.notPaid)}
				onEmployeeClicked={onHire}
			/>
		</>
	);
}

export default HiringWindow;
