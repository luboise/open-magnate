import {
	EmployeeNode,
	EmployeesById,
	IsValidEmployeeTree,
	ParseEmployeeTree,
	SerialiseEmployeeTree,
	createCEOEmployee
} from "../../../../shared";
import { Employee } from "../../../../shared/EmployeeTypes";

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
		createCEOEmployee(3),
		EmployeesById["mgmt_1"],
		EmployeesById["mgmt_1"],
		EmployeesById["mgmt_1"],
		EmployeesById["mgmt_1"],
		EmployeesById["food_1"],
		EmployeesById["food_1"],
		EmployeesById["food_1"],
		EmployeesById["food_1"],
		EmployeesById["food_1"],
		EmployeesById["food_1"],
		EmployeesById["food_1"],
		EmployeesById["food_1"]
	];
});

describe("Testing Employees", () => {
	describe("Testing IsValidEmployeeTree()", () => {
		test("Valid trees should return true", () => {
			expect(
				IsValidEmployeeTree(testTree, list)
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
				IsValidEmployeeTree(tree, list)
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
				IsValidEmployeeTree(tree, list)
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
				IsValidEmployeeTree(tree, list)
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
				IsValidEmployeeTree(tree, list)
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
				IsValidEmployeeTree(tree, list)
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
				IsValidEmployeeTree(tree, list)
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
				IsValidEmployeeTree(tree, list)
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
				IsValidEmployeeTree(tree, list)
			).toBeFalsy();
		});
	});

	describe("Testing SerialiseEmployeeTree()", () => {
		test("Valid trees should serialize to a string", () => {
			expect(SerialiseEmployeeTree(testTree)).toBe(
				"0[1[5,6],2[7,8],X]"
			);
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
				SerialiseEmployeeTree(tree).startsWith("0[")
			).toBeTruthy();
		});
	});

	describe("Testing ParseEmployeeTree()", () => {
		test("Valid strings should parse to a tree", () => {
			const stringToParse = "0[1[5,6],2[7,8],X]";

			const tree = ParseEmployeeTree(stringToParse);

			expect(
				IsValidEmployeeTree(tree!, list)
			).toBeTruthy();

			expect(tree).toBeTruthy();

			const serialized = SerialiseEmployeeTree(tree!);

			expect(serialized).toStrictEqual(stringToParse);
		});
	});
});

