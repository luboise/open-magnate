import { HTMLAttributes, useMemo } from "react";
import { EmployeeNode } from "../../../../../shared/EmployeeStructure";
import { Employee } from "../../../../../shared/EmployeeTypes";

export type TreeNodeDropCallback = (
	parent: number,
	newChild: number,
	parentIndex: number
) => void;

interface BaseProps {
	dragTarget: boolean;
	dropTarget: boolean;
	parentEmployeeIndex: number;
	employee: Employee | null;
	indexInParent: number;
}

interface EmptySlotProps extends BaseProps {
	employee: null;
}

interface CardSlotProps extends BaseProps {
	employee: Employee;
}

type CardMakerCallbackProps =
	| EmptySlotProps
	| CardSlotProps;

export type CardMakerCallbackType =
	({}: CardMakerCallbackProps) => JSX.Element;

interface EmployeeTreeNodeProps
	extends HTMLAttributes<HTMLDivElement> {
	node: EmployeeNode;
	employeeList: Employee[];
	cardMakerCallback: CardMakerCallbackType;
	depth?: number;
}

// 400 pixels apart
const NODE_HORIZONTAL_DISTANCE = 100;
const NODE_VERTICAL_DISTANCE = 400;

function EmployeeTreeNode({
	node: parent,
	employeeList,
	depth = 1,
	// dropCallback,
	cardMakerCallback,
	...args
}: EmployeeTreeNodeProps) {
	const employee = employeeList[parent.data];

	// console.debug(
	// 	"Children of node ",
	// 	node,
	// 	": ",
	// 	node.children
	// );

	// const makeDropProperties = useCallback(
	// 	(index: number): HTMLAttributes<HTMLDivElement> => {
	// 		return {
	// 			onDragEnter: (event) => {
	// 				event.preventDefault();
	// 				console.debug("Enter");
	// 			},
	// 			onDragOver: (e) => e.preventDefault(),
	// 			onDrop: (event) => {
	// 				if (!dropCallback) {
	// 					console.debug(
	// 						"No drop callback provided. Ignoring drop event."
	// 					);
	// 					return;
	// 				}

	// 				// event.preventDefault();
	// 				dropCallback(
	// 					parent.data,
	// 					Number(
	// 						event.dataTransfer.getData(
	// 							"number"
	// 						)
	// 					),
	// 					index
	// 				);
	// 			}
	// 		};
	// 	},
	// 	[]
	// );

	const childNodes: JSX.Element[] = parent.children.map(
		(child, _childIndex) => {
			return child !== null ? (
				<EmployeeTreeNode
					node={child}
					employeeList={employeeList}
					depth={depth + 1}
					cardMakerCallback={cardMakerCallback}
				/>
			) : (
				cardMakerCallback({
					employee: null,
					parentEmployeeIndex: parent.data,
					indexInParent: _childIndex,
					dragTarget: false,
					dropTarget: true
				})
			);
		}
	);

	const depthMap: Record<number, number> = {
		1: 310,
		2: 108,
		3: 200
	};

	// TODO: Double check parent index is correct
	const cardElement = useMemo(() => {
		return cardMakerCallback({
			employee,
			indexInParent: 0,
			parentEmployeeIndex: parent.data,
			dragTarget: depth > 1,
			dropTarget: true
		});
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
						childNodes.length * depthMap[depth]
				}}
			>
				{...childNodes}
			</div>
		</div>
	);
}

export default EmployeeTreeNode;

