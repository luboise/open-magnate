import {
	CEOEmployee,
	Employee,
	EmployeeNode
} from "magnate-core/game/Employee/index";

let testTree: EmployeeNode;
let list: Employee[] = [];

beforeEach(() => {
	testTree = {
		data: 0,
		children: [
			{
				data: 1,
				children: [
					{
						data: 5,
						children: []
					},

					{
						data: 6,
						children: []
					}
				]
			},
			{
				data: 2,
				children: [
					{
						data: 7,
						children: []
					},
					{
						data: 8,
						children: []
					}
				]
			},
			null
		]
	};

	list = [
		CEOEmployee.create(3),
		Employee.fromId("mgmt_1"),
		Employee.fromId("mgmt_1"),
		Employee.fromId("mgmt_1"),
		Employee.fromId("mgmt_1"),
		Employee.fromId("food_basic"),
		Employee.fromId("food_basic"),
		Employee.fromId("food_basic"),
		Employee.fromId("food_basic"),
		Employee.fromId("food_basic"),
		Employee.fromId("food_basic"),
		Employee.fromId("food_basic"),
		Employee.fromId("food_basic")
	];
});

describe("Testing Employees", () => {
	describe("Testing EmployeeNode.isValidTree()", () => {
		test("Valid trees should return true", () => {
			expect(
				EmployeeNode.isValidTree(testTree, list)
			).toBeTruthy();
		});

		test("A tree without the CEO at the top should fail", () => {
			const tree: EmployeeNode = {
				data: 1,
				children: [
					{
						data: 5,
						children: []
					},
					{
						data: 6,
						children: []
					}
				]
			};

			expect(
				EmployeeNode.isValidTree(tree, list)
			).toBeFalsy();
		});

		test("A tree with a CEO anywhere but the top should fail", () => {
			const tree: EmployeeNode = {
				data: 0,
				children: [
					// 12 is a second CEO, which would be invalid
					{
						data: 12,
						children: [null, null, null]
					},
					{ data: 3, children: [null, null] },
					{ data: 4, children: [null, null] }
				]
			};

			expect(
				EmployeeNode.isValidTree(tree, list)
			).toBeFalsy();
		});

		test("A tree with management anywhere but depth 1 should fail", () => {
			const tree: EmployeeNode = {
				data: 0,
				children: [
					{
						data: 2,
						children: [
							// Index 3 is a management trainee, which isn't allowed at depth 2
							{
								data: 3,
								children: [null, null]
							},
							null
						]
					},
					null,
					null
				]
			};

			expect(
				EmployeeNode.isValidTree(tree, list)
			).toBeFalsy();
		});

		test("Non-management/CEO employees shouldn't have children", () => {
			const tree: EmployeeNode = {
				data: 0,
				children: [
					{
						data: 4,
						children: [
							{ data: 6, children: [] }
						]
					},
					null,
					null
				]
			};

			expect(
				EmployeeNode.isValidTree(tree, list)
			).toBeFalsy();
		});

		test("Management staff should have the correct number of children", () => {
			const tree: EmployeeNode = {
				data: 0,
				children: [
					{
						data: 1,
						// This management trainee should have only 2 children
						children: [null, null, null]
					},
					null,
					null
				]
			};

			expect(
				EmployeeNode.isValidTree(tree, list)
			).toBeFalsy();
		});

		test("A node with negative index should fail", () => {
			const tree: EmployeeNode = {
				data: 0,
				children: [
					{
						data: -1,
						children: [null, null]
					},
					null,
					null
				]
			};

			expect(
				EmployeeNode.isValidTree(tree, list)
			).toBeFalsy();
		});

		test("A node with out-of-bounds index should fail", () => {
			const tree: EmployeeNode = {
				data: 0,
				children: [
					{
						data: list.length,
						children: []
					},
					null,
					null
				]
			};

			expect(
				EmployeeNode.isValidTree(tree, list)
			).toBeFalsy();
		});

		test("A node with decimal index should fail", () => {
			const tree: EmployeeNode = {
				data: 0,
				children: [
					{
						data: 6.5,
						children: []
					},
					null,
					null
				]
			};

			expect(
				EmployeeNode.isValidTree(tree, list)
			).toBeFalsy();
		});
	});

	describe("Testing EmployeeNode.serialiseTree()", () => {
		test("Valid trees should serialize to a string", () => {
			expect(
				EmployeeNode.serialiseTree(testTree)
			).toBe("0[1[5,6],2[7,8],X]");
		});

		test("A tree with a CEO at the top should serialise correctly", () => {
			const tree: EmployeeNode = {
				data: 0,
				children: [
					{
						data: 3,
						children: [null, null]
					},
					null,
					null
				]
			};

			expect(
				EmployeeNode.serialiseTree(tree).startsWith(
					"0["
				)
			).toBeTruthy();
		});
	});

	describe("Testing EmployeeNode.deserializeTree()", () => {
		test("Valid strings should parse to a tree", () => {
			const stringToParse = "0[1[5,6],2[7,8],X]";

			const tree =
				EmployeeNode.deserializeTree(stringToParse);

			expect(
				EmployeeNode.isValidTree(tree!, list)
			).toBeTruthy();

			expect(tree).toBeTruthy();

			const serialized = EmployeeNode.serialiseTree(
				tree!
			);

			expect(serialized).toStrictEqual(stringToParse);
		});
	});
});
