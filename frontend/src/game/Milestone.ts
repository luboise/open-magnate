export type Milestone = {
	name: string;
	description: string;
	onGain?: () => void;
};
