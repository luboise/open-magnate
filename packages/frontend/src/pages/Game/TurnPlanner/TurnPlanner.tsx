import "./TurnPlanner.css";

import { HTMLAttributes, useEffect, useMemo, useState } from "react";
import CustomPanel from "../../../global_components/CustomPanel";
import { useDerivedGameState } from "../../../hooks/game/useDerivedGameState";
import useTurnPlanning from "../../../hooks/game/useTurnPlanning";
import EmployeeCard from "../Employees/EmployeeCard";
import DemandSelector from "./DemandSelector";
import HiringWindow from "./HiringWindow";
import MarketingWindow from "./MarketingWindow";
import { CreateDemandAction, Employee, EmployeeNode } from "magnate-core/game";
import Button from "../../../global_components/Button";
import TrainingWindow from "./TrainingWindow";

interface TurnPlannerProps
	extends HTMLAttributes<HTMLDivElement> { }

function TurnPlanner({ ...args }: TurnPlannerProps) {
	const { currentTree, employees, privatePlayerData: playerData, publicPlayerData } =
		useDerivedGameState();

	const { actions: turnActions, addAction, removeActionsByEmployee, unworkedEmployees } =
		useTurnPlanning();

	const [
		selectedEmployeeIndex,
		setSelectedEmployeeIndex
	] = useState<number | null>(null);

	const [useModern, setUseModern] = useState<boolean>(false);

	if (!currentTree || !playerData) return <></>;

	/*
	const treeEmployees: Employee[] = EmployeeNode.getAllTreeData<number>(
		playerData.tree
	).map((index) => employees[index]);
	*/

	// TODO: Clean this up to be more efficient
	const eventWindow = useMemo((): JSX.Element | null => {
		if (
			selectedEmployeeIndex === null ||
			selectedEmployeeIndex < 0 ||
			selectedEmployeeIndex >= employees.length
		)
			return null;

		const employee = employees[selectedEmployeeIndex];

		if (
			(employee.department === "RECRUITMENT" && employee.hiringSlots > 0) ||
			employee.department === "CEO"
		)
			return (
				<HiringWindow
					employeeHiringIndex={
						selectedEmployeeIndex
					}
					onClose={clearSelectedEmployee}
				/>
			);

		if (employee.department === "RECRUITMENT" && employee.trainingSlots > 0) {
			return (
				<TrainingWindow
					employeeTrainingIndex={
						selectedEmployeeIndex
					}
					onClose={clearSelectedEmployee}
				/>
			)
		}

		if (employee.department === "MARKETING")
			return (
				<MarketingWindow
					employeeHiringIndex={
						selectedEmployeeIndex
					}
				/>
			);

		if (employee.department === "FOOD") {
			if (employee.employeeType === "food_basic")
				return (
					<DemandSelector
						demands={
							employee.supply.demand_type
						}
						onDemandClicked={(demandType) => {
							addAction({
								type: "CREATE_DEMAND",
								employeeIndex: selectedEmployeeIndex,
								demand: demandType,
								amount: employee.supply
									.amount
							} satisfies Omit<
								CreateDemandAction,
								"playerIndex"
							>);
							clearSelectedEmployee();
						}}
					/>
				);
		}

		return null;
	}, [selectedEmployeeIndex, employees]);

	function clearSelectedEmployee() {
		setSelectedEmployeeIndex(null);
	}

	useEffect(() => {
		console.debug(`Selected employee ${selectedEmployeeIndex} in the turn planner.`);
	}, [selectedEmployeeIndex]);

	const hiresAvailable: number =
		unworkedEmployees.map(e => {
			const emp = employees[e];
			return emp.department === "CEO" ? 1 : emp.department === "RECRUITMENT" ? emp.hiringSlots : 0
		}).reduce((acc, curr) => acc + curr, 0);

	const trainsAvailable: number =
		unworkedEmployees.map(e => {
			const emp = employees[e];
			return emp.department === "RECRUITMENT" ? emp.trainingSlots : 0
		}).reduce((acc, curr) => acc + curr, 0);

	return (
		<>
			<div className="game-turn-planner" {...args}>
				{/* Panel which opens to resolve if an employee has been clicked */}
				{eventWindow !== null ? (
					<CustomPanel
						className="event-window"
						onClose={clearSelectedEmployee}
					>
						{eventWindow}
					</CustomPanel>
				) : (
					<></>
				)}

				<div className="game-turn-planner-employee-section">
					<div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", padding: "0 1em" }}>
						<h2>Use your employees!</h2>
						<div style={{ display: "flex" }}>
							<Button inactive={!useModern} onClick={() => setUseModern(false)}>Classic</Button>
							<Button inactive={useModern} onClick={() => setUseModern(true)}>Modern</Button>
						</div>
					</div>

					{useModern ?
						<div style={{ display: "grid", width: "100%" }}>
							<div style={{ display: "flex" }}>
								<h3>Recruit</h3>
								<span>{hiresAvailable} available</span>
								<Button inactive={hiresAvailable === 0} onClick={() => {
									const newIndex =
										unworkedEmployees.find((index) => {
											const employee: Employee = employees[index];

											return employee.department === "CEO" || (employee.department === "RECRUITMENT" && employee.hiringSlots > 0);
										});

									setSelectedEmployeeIndex((old) => newIndex === undefined ? old : newIndex);
								}}>+</Button>

								{...Object.entries(turnActions)
									.filter(([index, _]) => ["RECRUITMENT", "CEO"].includes(employees[Number(index)].department))
									.map(([index, actions]) => <div>
										{...(actions.filter(action => action.type === "RECRUIT")).map(
											action =>
												<EmployeeCard employee={Employee.fromType(action.recruiting)} onClick={() => removeActionsByEmployee(Number(index))} />
										)}
									</div>)}



							</div>

							<div style={{ display: "flex" }}>
								<h3>Train</h3>

								<span>{trainsAvailable} available</span>

								<Button inactive={trainsAvailable === 0} onClick={() => {
									const newIndex =
										unworkedEmployees.find((index) => {
											const employee: Employee = employees[index];
											return (employee.department === "RECRUITMENT" && employee.trainingSlots > 0);
										});

									setSelectedEmployeeIndex((old) => newIndex === undefined ? old : newIndex);
								}}>+</Button>

								{...Object.entries(turnActions)
									.filter(([index, _]) => ["RECRUITMENT"].includes(employees[Number(index)].department))
									.map(([index, actions]) => <div>
										{...(actions.filter(action => action.type === "TRAIN")).map(
											action =>
												<EmployeeCard employee={Employee.fromType(action.training)} onClick={() => removeActionsByEmployee(Number(index))} />
										)}
									</div>)}
							</div>

							<div style={{ display: "flex" }}>
								Market
							</div>

							<div style={{ display: "flex" }}>
								Produce
							</div>

							<div style={{ display: "flex" }}>
								Develop
							</div>
						</div>
						// Classic view
						: <div className="game-turn-planner-employees">
							{...employees.map(
								(employee, i) => (
									!(EmployeeNode.treeContainsValue(publicPlayerData.tree, i)) ? <></> :
										<EmployeeCard
											employee={employee}
											onClick={() =>
												unworkedEmployees.includes(i) &&
												setSelectedEmployeeIndex(
													i
												)
											}
											style={
												unworkedEmployees.includes(i) ? {} :
													{
														filter: "grayscale(0.3)",
														opacity: 0.35
													}}
											className={
												selectedEmployeeIndex ===
													i
													? "item-highlighted"
													: undefined
											}
										/>
								)
							)
							}
						</div>}



				</div>
				{
					useModern ? <></> :
						<div className="game-turn-planner-action-section">
							<div className="game-turn-planner-actions">
								{/*
								...turnActions.map(
									(action, index) => (
										<GameActionPreview
											gameAction={action}
											onDestroy={() => {
												removeAction(index);
											}}
										/>
									)
								)*/}
							</div>
						</div>
				}
			</div >
		</>
	);
}

export default TurnPlanner;
