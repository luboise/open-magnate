const MGMT_EMPLOYEE_IDS = [
	"mgmt_1",
	"mgmt_2",
	"mgmt_3",
	"mgmt_4",
	"mgmt_5"
] as const;

const FOOD_EMPLOYEE_IDS = [
	"food_basic",
	"burger_1",
	"burger_2",
	"pizza_1",
	"pizza_2"
] as const;
// const MARKETING_NAMES = [
// 	"Marketing Trainee",
// 	"Campaign Manager",
// 	"Brand Manager",
// 	"Brand Director"
// ] as const;
// const DRINK_NAMES = [
// 	"Errand Boy",
// 	"Cart Operator",
// 	"Truck Driver",
// 	"Zeppelin Pilot"
// ] as const;
// const TRAINER_NAMES = ["Trainer", "Coach", "Guru"] as const;
// const RECRUITER_NAMES = [
// 	"Recruiting Girl",
// 	"Recruiting Manager",
// 	"HR Director"
// ] as const;
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

export type MGMT_EMPLOYEE_ID =
	(typeof MGMT_EMPLOYEE_IDS)[number];
export type FOOD_EMPLOYEE_ID =
	(typeof FOOD_EMPLOYEE_IDS)[number];
// export type MARKETING_NAME =
// 	(typeof MARKETING_NAMES)[number];
// export type DRINK_NAME = (typeof DRINK_NAMES)[number];
// export type TRAINER_NAME = (typeof TRAINER_NAMES)[number];
// export type RECRUITER_NAME =
// 	(typeof RECRUITER_NAMES)[number];
// export type PRICER_NAME = (typeof PRICER_NAMES)[number];
// export type RED_NAME = (typeof RED_NAMES)[number];
// export type PINK_NAME = (typeof PINK_NAMES)[number];

// TODO: Implement the rest of the employees
export type EMPLOYEE_ID =
	| MGMT_EMPLOYEE_ID
	| FOOD_EMPLOYEE_ID;
// | MARKETING_NAME
// | DRINK_NAME
// | TRAINER_NAME
// | RECRUITER_NAME
// | PRICER_NAME
// | RED_NAME
// | PINK_NAME

