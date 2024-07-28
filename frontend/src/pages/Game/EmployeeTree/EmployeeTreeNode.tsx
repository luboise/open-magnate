import { HTMLAttributes, useMemo } from "react";
import { EmployeeNode } from "../../../../../shared/EmployeeStructure";
import { Employee } from "../../../../../shared/EmployeeTypes";
import EmployeeCard from "./EmployeeCard";

export type TreeNodeDropCallback = (
	parent: number,
	newChild: number,
	parentIndex: number
) => void;

interface EmployeeTreeNodeProps
	extends HTMLAttributes<HTMLDivElement> {
	node: EmployeeNode;
	employeeList: Employee[];
	cardMakerCallback?: (
		employee: Employee,
		index: number
	) => JSX.Element;
	depth?: number;
	dropCallback?: TreeNodeDropCallback;
}

// 400 pixels apart
const NODE_HORIZONTAL_DISTANCE = 100;
const NODE_VERTICAL_DISTANCE = 400;

function EmployeeTreeNode({
	node: parent,
	employeeList,
	depth,
	dropCallback,
	cardMakerCallback,
	...args
}: EmployeeTreeNodeProps) {
	const checkedDepth = depth ?? 1;

	const employee = employeeList[parent.data];

	// console.debug(
	// 	"Children of node ",
	// 	node,
	// 	": ",
	// 	node.children
	// );

	const childNodes: JSX.Element[] = parent.children.map(
		(child, index) =>
			child !== null ? (
				<EmployeeTreeNode
					node={child}
					employeeList={employeeList}
					depth={checkedDepth + 1}
					dropCallback={dropCallback}
					cardMakerCallback={cardMakerCallback}
				/>
			) : (
				<div
					style={{
						width: 100,
						height: 100,
						backgroundColor: "red"
					}}
					onDragEnter={(event) => {
						event.preventDefault();
						console.debug("Enter");
					}}
					onDragOver={(e) => e.preventDefault()}
					onDrop={(event) => {
						if (!dropCallback) {
							console.debug(
								"No drop callback provided. Ignoring drop event."
							);
							return;
						}

						// event.preventDefault();
						dropCallback(
							parent.data,
							Number(
								event.dataTransfer.getData(
									"number"
								)
							),
							index
						);
					}}
				/>
			)
	);

	const depthMap: Record<number, number> = {
		1: 310,
		2: 108,
		3: 200
	};

	const cardElement = useMemo(() => {
		return cardMakerCallback ? (
			cardMakerCallback(employee, parent.data)
		) : (
			<EmployeeCard employee={employee} />
		);
	}, [cardMakerCallback]);

	return (
		<div className="game-employee-tree-node" {...args}>
			{cardElement}
			<div
				className="game-employee-tree-node-children"
				style={{
					position: "absolute",
					translate: "-50% 50%",
					left: "50%",
					width:
						childNodes.length *
						depthMap[checkedDepth]
				}}
			>
				{...childNodes}
			</div>
		</div>
	);
}

export default EmployeeTreeNode;

