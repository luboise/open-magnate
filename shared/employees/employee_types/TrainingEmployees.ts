import {
	BaseEmployee,
	EMPLOYEE_COLOUR,
	EmployeeCreationData
} from "../EmployeeTypes";

const TRAINING_EMPLOYEE_IDS = ["trainer"] as const;

// Will be expanded later with movie star employees
export type TRAINING_EMPLOYEE_ID =
	(typeof TRAINING_EMPLOYEE_IDS)[number];

export interface TrainingEmployee extends BaseEmployee {
	type: "TRAINING";
	id: TRAINING_EMPLOYEE_ID;
	colour: EMPLOYEE_COLOUR.TRAINER_GREY;
	trainingSlots: number;
	canMultiTrain: boolean;
}

function createTrainingEmployee({
	id,
	name,
	canMultiTrain = true,
	trainingSlots,
	oneOf,
	notPaid = false,
	buildsInto
}: EmployeeCreationData<TrainingEmployee>): TrainingEmployee {
	return {
		type: "TRAINING",
		colour: EMPLOYEE_COLOUR.TRAINER_GREY,
		id,
		name,
		trainingSlots: trainingSlots,
		canMultiTrain: canMultiTrain,
		buildsInto,
		oneOf,
		notPaid
	};
}

export const TrainingEmployees: Record<
	TRAINING_EMPLOYEE_ID,
	TrainingEmployee
> = {
	trainer: createTrainingEmployee({
		id: "trainer",
		buildsInto: [],
		notPaid: true,
		trainingSlots: 1,
		canMultiTrain: false,
		name: "Trainer"
	})
} as const;
