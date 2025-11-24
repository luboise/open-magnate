import {
	BaseEmployee,
	EmployeeColour,
	EmployeeCreationData
} from "..";

const RecruitmentEmployeeTypes = [
	// Training
	"trainer",
	"coach",
	"guru",
	// Recruitment
	"recruiting_girl",
	"recruiting_manager",
	"hr_director"
] as const;

// Will be expanded later with movie star employees
export type RecruitmentEmployeeType =
	(typeof RecruitmentEmployeeTypes)[number];

export interface RecruitmentEmployee extends BaseEmployee {
	department: "RECRUITMENT";
	employeeType: RecruitmentEmployeeType;
	colour: EmployeeColour.RECRUITMENT_GREY;
	hiringSlots: number;
	canReduceSalary: boolean;
	trainingSlots: number;
}

function createRecruitmentEmployee({
	employeeType,
	name,
	hiringSlots,
	trainingSlots,
	canReduceSalary,
	oneOf,
	buildsInto,
	notPaid = false
}: EmployeeCreationData<RecruitmentEmployee>): RecruitmentEmployee {
	return {
		department: "RECRUITMENT",
		colour: EmployeeColour.RECRUITMENT_GREY,
		employeeType,
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
	RecruitmentEmployeeType,
	RecruitmentEmployee
> = {
	trainer: createRecruitmentEmployee({
		employeeType: "trainer",
		name: "Trainer",
		buildsInto: [],
		hiringSlots: 0,
		trainingSlots: 1,
		notPaid: true,
		canReduceSalary: false
	}),
	coach: createRecruitmentEmployee({
		employeeType: "coach",
		name: "Coach",
		buildsInto: [],
		hiringSlots: 0,
		trainingSlots: 2,
		canReduceSalary: false
	}),
	guru: createRecruitmentEmployee({
		employeeType: "guru",
		name: "Guru",
		buildsInto: [],
		hiringSlots: 0,
		trainingSlots: 3,
		canReduceSalary: false,
		oneOf: true
	}),

	recruiting_girl: createRecruitmentEmployee({
		employeeType: "recruiting_girl",
		name: "Recruiting Girl",
		buildsInto: [],
		notPaid: true,
		hiringSlots: 1,
		canReduceSalary: false,
		trainingSlots: 0
	}),
	recruiting_manager: createRecruitmentEmployee({
		employeeType: "recruiting_manager",
		name: "Recruiting Manager",
		buildsInto: [],
		hiringSlots: 2,
		canReduceSalary: true,
		trainingSlots: 0
	}),
	hr_director: createRecruitmentEmployee({
		employeeType: "hr_director",
		name: "HR Director",
		buildsInto: [],
		hiringSlots: 4,
		canReduceSalary: true,
		trainingSlots: 0
	})
} as const;
