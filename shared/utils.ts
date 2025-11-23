// type TreeNode<T extends string | number | symbol> = Record<
// 	T,
// 	Array<TreeNode<T> | null>
// >;
export type TreeNode<T> = {
	data: T;
	children: Array<TreeNode<T> | null>;
};

// Code snippet taken from https://stackoverflow.com/a/196991
export function toTitleCase(str: string) {
	return str
		.replaceAll(/(s+|_)/g, " ")
		.replaceAll(
			/\w\S*/g,
			(text) =>
				text.charAt(0).toUpperCase() +
				text.substring(1).toLowerCase()
		);
}
export function Clamp(
	val: number,
	min: number,
	max: number,
	floor: boolean = false
) {
	const clamped = Math.min(Math.max(val, min), max);

	return floor ? Math.floor(clamped) : clamped;
}

export function IsInRange(
	val: number,
	min: number,
	max: number
): boolean {
	return val === Clamp(val, min, max);
}

export function ReduceTupleArray<
	T1 extends string | number | symbol,
	T2
>(array: Array<[T1, T2]>): Record<T1, T2> {
	const val = array.reduce<Record<T1, T2>>(
		(prev, [key, val]) => {
			prev[key] = val;
			return prev;
		},
		{} as Record<T1, T2>
	);
	return val;
}
