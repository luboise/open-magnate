const MANAGEMENT_NAMES = [
	"Management Trainee",
	"Junior Vice President",
	"Vice President",
	"Senior Vice President",
	"Executive Vice President"
] as const;
const FOOD_NAMES = [
	"Kitchen Trainee",
	"Burger Cook",
	"Pizza Cook",
	"Burger Chef",
	"Pizza Chef"
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

export type MANAGEMENT_NAME =
	(typeof MANAGEMENT_NAMES)[number];
export type FOOD_NAME = (typeof FOOD_NAMES)[number];
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
export type EMPLOYEE_NAME = MANAGEMENT_NAME | FOOD_NAME;
// | MARKETING_NAME
// | DRINK_NAME
// | TRAINER_NAME
// | RECRUITER_NAME
// | PRICER_NAME
// | RED_NAME
// | PINK_NAME

