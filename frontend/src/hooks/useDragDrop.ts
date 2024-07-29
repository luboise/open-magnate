import { HTMLAttributes, useRef } from "react";

export type DragCallback<DragData> = (
	dragData: DragData
) => void;

export type AfterDropCallback<DD, RR> = (
	dragData: DD,
	receiverData: RR
) => void;

export type SpreadIfDragFunction<DragData> = (
	data: DragData
) => HTMLAttributes<HTMLElement>;

export type SpreadIfDropFunction<ReceiverData> = (
	data: ReceiverData
) => HTMLAttributes<HTMLElement>;

type DragDropProps<DD, RD> = {
	dragStartCallback?: DragCallback<DD>;
	afterDrop: AfterDropCallback<DD, RD>;
};

function useDragDrop<DraggerData, ReceiverData>({
	dragStartCallback,
	afterDrop
}: DragDropProps<DraggerData, ReceiverData>) {
	const element = useRef<HTMLDivElement | null>(null);

	const spreadIfDrag: SpreadIfDragFunction<
		DraggerData
	> = (data) => {
		return {
			draggable: true,
			onDrag: (event) => {
				event.preventDefault();

				// console.debug("drag", event.screenX, event.screenY);

				// div.style.translate = `${event.clientX}px ${event.clientY}px`;
				// div.style.position = "fixed";
			},
			onDragEnd: (_event) => {
				if (!element.current) {
					console.debug(
						"Drag end: no element found"
					);
					return;
				}

				// styleDraggee(element.current, true);

				element.current = null;

				console.debug("drag end");
			},
			onDragStart: (event) => {
				const div = event.target as HTMLDivElement;

				event.dataTransfer.setDragImage(
					div,
					div.clientWidth / 2,
					div.clientHeight / 2
				);

				element.current = div;

				console.debug("Started dragging: ", div);

				event.dataTransfer.setData(
					"string",
					String(data)
				);

				if (dragStartCallback)
					dragStartCallback(data);
			}
		};
	};

	// if (employeeDragged !== 0 && !employeeDragged)
	// 	throw new Error(
	// 		`Invalid employee dragged: ${employeeDragged}`
	// 	);

	const spreadIfDrop: SpreadIfDropFunction<
		ReceiverData
	> = (receiverData) => {
		return {
			onDragEnter: (event) => {
				event.preventDefault();
			},
			onDragOver: (e) => e.preventDefault(),
			onDrop: (event) => {
				// event.preventDefault();
				console.debug(
					`Drop event received: ${event}`
				);

				const dragData = event.dataTransfer.getData(
					"number"
				) as DraggerData;

				afterDrop(dragData, receiverData);
			}
		};
	};

	return { spreadIfDrag, spreadIfDrop };
}

// function styleDraggee(
// 	_element: HTMLElement,
// 	_revert: boolean = false
// ) {}

export default useDragDrop;
