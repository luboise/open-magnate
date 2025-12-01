import { useEffect, useMemo, useState } from "react";
import { useDerivedGameState } from "../../../hooks/game/useDerivedGameState";
import useTurnPlanning from "../../../hooks/game/useTurnPlanning";
import ReserveDisplay from "../Reserve/ReserveDisplay";
import { EmployeeNode, EmployeeType, TrainAction } from "magnate-core";

type Props = {
	employeeTrainingIndex: number;
	onClose?: () => void | Promise<void>;
};

function TrainingWindow({
	employeeTrainingIndex,
	onClose
}: Props) {
	const { employees: myEmployees, publicPlayerData } = useDerivedGameState();

	const { addAction } = useTurnPlanning();

	const employee = useMemo(() => {
		if (!myEmployees[employeeTrainingIndex])
			throw new Error(
				"Invalid employee index: " +
				employeeTrainingIndex
			);

		const trainer = myEmployees[employeeTrainingIndex];

		if (
			trainer.department !== "RECRUITMENT"
		)
			throw new Error("Invalid employee type");

		return trainer;
	}, [employeeTrainingIndex, myEmployees]);

	const [employeeToTrain, setEmployeeToTrain] = useState<number | null>(null);

	const [trainsRemaining, setTrainsRemaining] = useState<number>(
		employee.trainingSlots
	);

	function onEmployeeClicked(employeeType: EmployeeType) {
		if (employeeToTrain === null) {
			const traineeIndex = myEmployees.findIndex((emp, i) =>
				emp.employeeType === employeeType &&
				!EmployeeNode.treeContainsValue(publicPlayerData.tree, i));

			if (traineeIndex === -1) {
				console.error("No employee of type ", employeeType, " available.");
				return;
			}

			setEmployeeToTrain(traineeIndex);

			return;
		}
		else {
			const newTrain: Omit<TrainAction, "player"> = {
				employeeIndex: employeeTrainingIndex,
				traineeIndex: employeeToTrain,
				newRole: employeeType,
				type: "TRAIN"
			};

			addAction(newTrain);
			setTrainsRemaining(
				(previousTrains) => previousTrains - 1
			);

			setEmployeeToTrain(null);
		}
	}

	useEffect(() => {
		if (trainsRemaining <= 0) onClose && onClose();
	}, [trainsRemaining]);

	return (
		<>
			<p>Trains Remaining: {trainsRemaining}</p>
			<p>	{employeeToTrain === null ? "Select an employee to train." : "Select a role to train them into."}</p>

			<ReserveDisplay
				employeeFilter={(e) => {
					if (employeeToTrain === null) {
						const beachEmployees = myEmployees.filter((emp, i) =>
							(emp.buildsInto.length > 0) &&
							(!EmployeeNode.treeContainsValue(publicPlayerData.tree, i)));

						// If any of the beached employees match the given type
						const status: boolean = beachEmployees.some(emp => emp.employeeType === e.employeeType);
						if (status) {
							console.log("BRUH");
						}

						return status;
					}
					else {
						const emp = myEmployees[employeeToTrain];
						console.debug(emp);

						return emp.buildsInto.includes(e.employeeType as EmployeeType);
					}
				}}
				onEmployeeClicked={onEmployeeClicked}
			/>
		</>
	);
}

export default TrainingWindow;
