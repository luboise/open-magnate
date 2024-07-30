import { useMemo } from "react";
import { useGameState } from "../../../hooks/game/useGameState";
import ReserveDisplay from "../Reserve/ReserveDisplay";

type Props = {
	employeeHiringIndex: number;
};

function HiringWindow({ employeeHiringIndex }: Props) {
	const { myEmployees } = useGameState();

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

	return (
		<ReserveDisplay
			employeeFilter={(e) => Boolean(e.notPaid)}
		/>
	);
}

export default HiringWindow;
