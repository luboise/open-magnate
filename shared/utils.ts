// type TreeNode<T extends string | number | symbol> = Record<
// 	T,
// 	Array<TreeNode<T> | null>
// >;
export type TreeNode<T> = {
	data: T;
	children: Array<TreeNode<T> | null>;
};

