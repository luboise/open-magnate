import { HTMLAttributes } from "react";
import { EmployeeNode } from "../../../../../../../shared/EmployeeStructure";
import { Employee } from "../../../../../../../shared/EmployeeTypes";
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
	depth?: number;
	dropCallback?: TreeNodeDropCallback;
}

// 400 pixels apart
const NODE_HORIZONTAL_DISTANCE = 100;
const NODE_VERTICAL_DISTANCE = 400;

function EmployeeTreeNode(props: EmployeeTreeNodeProps) {
	const {
		node: parent,
		employeeList,
		depth,
		dropCallback,
		...args
	} = props;
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

	return (
		<div className="game-employee-tree-node" {...args}>
			<EmployeeCard employee={employee} />
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
