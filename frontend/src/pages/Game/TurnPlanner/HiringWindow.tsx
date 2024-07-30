import { useMemo } from "react";
import { EMPLOYEE_ID } from "../../../../../shared/EmployeeIDs";
import { useGameState } from "../../../hooks/game/useGameState";
import useTurnPlanning from "../../../hooks/game/useTurnPlanning";
import { RecruitAction } from "../../../utils";
import ReserveDisplay from "../Reserve/ReserveDisplay";

type Props = {
	employeeHiringIndex: number;
};

function HiringWindow({ employeeHiringIndex }: Props) {
	const { myEmployees } = useGameState();

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

	function onHire(employeeId: EMPLOYEE_ID) {
		const newHire: Omit<RecruitAction, "player"> = {
			employeeIndex: employeeHiringIndex,
			recruiting: employeeId,
			type: "RECRUIT" as const
		};

		addAction(newHire);
	}

	return (
		<ReserveDisplay
			employeeFilter={(e) => Boolean(e.notPaid)}
			onEmployeeClicked={onHire}
		/>
	);
}

export default HiringWindow;
