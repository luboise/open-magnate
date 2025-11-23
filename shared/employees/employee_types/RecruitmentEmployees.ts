import {
	BaseEmployee,
	EMPLOYEE_COLOUR,
	EmployeeCreationData
} from "../EmployeeTypes";

const RECRUITMENT_EMPLOYEE_IDS = [
	// Training
	"trainer",
	"coach",
	"guru",
	// Recruitment
	"recruiting_girl",
	"recruiting_manager",
	"hr_director"
] as const;

// const PRICER_NAMES = [
// 	"Pricing Manager",
// 	"Luxuries Manager",
// 	"Discount Manager"
// ] as const;
// const RED_NAMES = [
// 	"Local Manager",
// 	"Regional Manager"
// ] as const;
// const PINK_NAMES = ["Waitress", "CEO"] as const;

// Will be expanded later with movie star employees
export type RecruitmentEmployeeId =
	(typeof RECRUITMENT_EMPLOYEE_IDS)[number];

export interface RecruitmentEmployee extends BaseEmployee {
	type: "RECRUITMENT";
	id: RecruitmentEmployeeId;
	colour: EMPLOYEE_COLOUR.RECRUITMENT_GREY;
	hiringSlots: number;
	canReduceSalary: boolean;
	trainingSlots: number;
}

function createRecruitmentEmployee({
	id,
	name,
	hiringSlots,
	trainingSlots,
	canReduceSalary,
	oneOf,
	buildsInto,
	notPaid = false
}: EmployeeCreationData<RecruitmentEmployee>): RecruitmentEmployee {
	return {
		type: "RECRUITMENT",
		colour: EMPLOYEE_COLOUR.RECRUITMENT_GREY,
		id,
		name,
		hiringSlots: hiringSlots,
		trainingSlots: trainingSlots,
		canReduceSalary,
		buildsInto,
		oneOf,
		notPaid
	};
}

export const RecruitmentEmployees: Record<
	RecruitmentEmployeeId,
	RecruitmentEmployee
> = {
	trainer: createRecruitmentEmployee({
		id: "trainer",
		name: "Trainer",
		buildsInto: [],
		hiringSlots: 0,
		trainingSlots: 1,
		notPaid: true,
		canReduceSalary: false
	}),
	coach: createRecruitmentEmployee({
		id: "coach",
		name: "Coach",
		buildsInto: [],
		hiringSlots: 0,
		trainingSlots: 2,
		canReduceSalary: false
	}),
	guru: createRecruitmentEmployee({
		id: "guru",
		name: "Guru",
		buildsInto: [],
		hiringSlots: 0,
		trainingSlots: 3,
		canReduceSalary: false,
		oneOf: true
	}),

	recruiting_girl: createRecruitmentEmployee({
		id: "recruiting_girl",
		name: "Recruiting Girl",
		buildsInto: [],
		notPaid: true,
		hiringSlots: 1,
		canReduceSalary: false,
		trainingSlots: 0
	}),
	recruiting_manager: createRecruitmentEmployee({
		id: "recruiting_manager",
		name: "Recruiting Manager",
		buildsInto: [],
		hiringSlots: 2,
		canReduceSalary: true,
		trainingSlots: 0
	}),
	hr_director: createRecruitmentEmployee({
		id: "hr_director",
		name: "HR Director",
		buildsInto: [],
		hiringSlots: 4,
		canReduceSalary: true,
		trainingSlots: 0
	})
} as const;
