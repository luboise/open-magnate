import { HTMLAttributes, useCallback, useRef } from "react";

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

	const spreadIfDrag = useCallback<
		SpreadIfDragFunction<DraggerData>
	>(
		(data) => {
			return {
				draggable: true,
				onDragStart: (event) => {
					// event.preventDefault();

					const div =
						event.target as HTMLDivElement;

					event.dataTransfer.setDragImage(
						div,
						div.clientWidth / 2,
						div.clientHeight / 2
					);

					element.current = div;

					console.debug(
						"Started dragging: ",
						div
					);

					event.dataTransfer.setData(
						"string",
						String(data)
					);

					if (dragStartCallback)
						dragStartCallback(data);
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
				onDrag: (event) => {
					event.preventDefault();
					// div.style.translate = `${event.clientX}px ${event.clientY}px`;
					// div.style.position = "fixed";
				}
			};
		},
		[dragStartCallback]
	);

	// if (employeeDragged !== 0 && !employeeDragged)
	// 	throw new Error(
	// 		`Invalid employee dragged: ${employeeDragged}`
	// 	);

	const spreadIfDrop = useCallback<
		SpreadIfDropFunction<ReceiverData>
	>(
		(receiverData) => {
			return {
				onDragEnter: (event) => {
					event.preventDefault();
				},
				onDragOver: (e) => {
					e.preventDefault();
					e.dataTransfer.dropEffect = "move";
				},
				onDrop: (event) => {
					event.preventDefault();
					console.debug(
						`Drop event received: ${event}`
					);

					const dragData =
						event.dataTransfer.getData(
							"string"
						) as DraggerData;

					console.debug(
						"Calling after drop function with drag data: ",
						dragData,
						" and receiver data: ",
						receiverData
					);
					afterDrop(dragData, receiverData);
				}
			};
		},
		[afterDrop]
	);

	return { spreadIfDrag, spreadIfDrop };
}

// function styleDraggee(
// 	_element: HTMLElement,
// 	_revert: boolean = false
// ) {}

export default useDragDrop;
