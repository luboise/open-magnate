import { Position } from "../../../backend/src/dataViews";
import useLocalVal from "../hooks/useLocalVal";
import { Colour, GetReactChildId } from "../utils";
import "./Resizable.css";

import React, {
	MouseEvent,
	MouseEventHandler,
	PropsWithChildren,
	useEffect,
	useMemo,
	useReducer
} from "react";

let resizableElementId = 1;

interface BaseResizeState {
	scaledWidth: number;
	details: {
		width: number;
		aspectRatio: number | undefined;
	};
	pos: Position;
}

interface IdleState extends BaseResizeState {
	type: "IDLE";
}
interface DraggingState extends BaseResizeState {
	type: "DRAGGING";
	dragFrom: Position;
	dragTo: Position;
}
interface MovingState extends BaseResizeState {
	type: "MOVING";
	moveFrom: Position;
	moveTo: Position;
}

type ResizableState =
	| IdleState
	| DraggingState
	| MovingState;

type ResizableAction =
	| {
			type: "START_RESIZE";
			pos: Position;
	  }
	| { type: "START_MOVING"; pos: Position }
	| { type: "MOVE_MOUSE"; pos: Position }
	| { type: "CLICK_RELEASED" }
	| {
			type: "SET_DIV_DETAILS";
			details: {
				width: number;
				aspectRatio: number;
			};
	  };

interface ResizableProps
	extends React.HTMLAttributes<HTMLDivElement> {
	defaultWidth?: number;
	orientation?: "Horizontal" | "Vertical";
	defaultPosition?: Position;
	color?: Colour;
	minimiseIf?: boolean;
}

// type MouseCallback = (e: globalThis.MouseEvent) => void;

// const mouseDownCallbacks: Array<MouseCallback> = [];
// const mouseMoveCallbacks: Array<MouseCallback> = [];

// document.body.addEventListener("mouseup", (event) =>
// 	mouseMoveCallbacks.forEach((callback) =>
// 		callback(event)
// 	)
// );
// document.body.addEventListener("mousedown", (event) =>
// 	mouseMoveCallbacks.forEach((callback) =>
// 		callback(event)
// 	)
// );

function Resizable(
	props: PropsWithChildren<ResizableProps> = {
		// defaultHeight: 0,
		defaultWidth: 700,
		color: "#000000"
	}
) {
	const {
		color,
		defaultWidth,
		defaultPosition,
		children,
		orientation,
		minimiseIf: minimized,
		...args
	} = props;

	const id = useMemo(() => {
		return GetReactChildId(children);
	}, [children]);

	if (!id)
		throw new Error(
			"Unable to find an id in the child component of a Resizeable component"
		);

	const [localVals, setLocalVals] = useLocalVal<{
		x: number;
		y: number;
		width: number;
	}>(`resizable-${resizableElementId++}`);

	const [state, dispatch] = useReducer(
		(
			state: ResizableState,
			action: ResizableAction
		): ResizableState => {
			// if (action.type !== "MOVE_MOUSE")
			// 	console.debug("Received action:", action);

			if (action.type === "SET_DIV_DETAILS") {
				const newState: ResizableState = {
					...state,

					details: {
						width: action.details.width,
						aspectRatio:
							action.details.aspectRatio
					}
				};

				return newState;
			}

			switch (state.type) {
				case "IDLE": {
					switch (action.type) {
						case "START_RESIZE": {
							return {
								...state,
								type: "DRAGGING",
								dragTo: action.pos,
								dragFrom: action.pos
							};
						}
						case "START_MOVING": {
							return {
								...state,
								type: "MOVING",
								moveFrom: action.pos,
								moveTo: action.pos
							};
						}
						default:
							return { ...state };
					}
				}
				case "DRAGGING": {
					switch (action.type) {
						case "MOVE_MOUSE":
							return {
								...state,
								dragTo: {
									...action.pos
								}
							};
						case "CLICK_RELEASED": {
							const newScaledWidth = state
								.details?.aspectRatio
								? getMinRectangleX(
										state.pos,
										state.dragTo,
										state.details
											.aspectRatio
									)
								: state.details.width;

							return {
								...state,
								type: "IDLE",
								scaledWidth: newScaledWidth
							};
						}
						default:
							return {
								...state
							};
					}
				}
				case "MOVING": {
					switch (action.type) {
						case "MOVE_MOUSE":
							return {
								...state,
								moveTo: {
									...action.pos
								}
							};
						case "CLICK_RELEASED": {
							const newX =
								state.moveTo.x -
								state.moveFrom.x +
								state.pos.x;

							const newY =
								state.moveTo.y -
								state.moveFrom.y +
								state.pos.y;

							return {
								...state,
								type: "IDLE",
								pos: {
									x: newX,
									y: newY
								}
							};
						}
						default:
							return {
								...state
							};
					}
				}
			}
		},
		{
			type: "IDLE",

			details: {
				width:
					localVals?.width ?? defaultWidth ?? 700,
				aspectRatio: undefined
			},
			scaledWidth:
				localVals?.width ?? defaultWidth ?? 700,

			pos: {
				x:
					(localVals &&
					localVals.x &&
					localVals.x !== defaultPosition?.x
						? localVals.x
						: null) ??
					localVals?.x ??
					defaultPosition?.x ??
					500,
				y: localVals?.y ?? defaultPosition?.y ?? 0
			}
		}
	);

	// const id = useRef(
	// 	props.id ??
	// 		`resizable-element-${resizableElementId++}`
	// );

	function fetchAspectRatio() {
		if (
			!state ||
			state.details.aspectRatio !== undefined
		)
			return;

		const element = document.getElementById(id);
		if (!element)
			throw new Error(
				`Unable to find resizable element by id ${id}.`
			);

		const { width, height } =
			element.getBoundingClientRect();

		const newDetails = {
			width,
			aspectRatio: width / height
		};

		dispatch({
			type: "SET_DIV_DETAILS",
			details: newDetails
		});
	}

	function addEventListeners() {
		const div = document.getElementById(id);

		if (!div)
			throw new Error(
				"Unable to find the div element"
			);

		div.addEventListener("mousemove", updatePos);
		div.addEventListener("mouseup", clickReleased);
	}

	function removeEventListeners() {
		// const element = document.getElementById(id);
		// if (!element)
		// 	throw new Error(
		// 		`Unable to find resizable element by id ${id}. This should have already been verified beforehand.`
		// 	);
		// element.removeEventListener("mousemove", updatePos);
		// element.removeEventListener(
		// 	"mouseup",
		// 	clickReleased
		// );
	}

	useEffect(() => {
		addEventListeners();

		return () => removeEventListeners();
	}, []);

	function startResize(e: MouseEvent) {
		e.preventDefault();

		if (state.type === "IDLE") {
			dispatch({
				type: "START_RESIZE",
				pos: { x: e.clientX, y: e.clientY }
			});
		}
	}

	function startMoving(e: MouseEvent) {
		e.preventDefault();

		if (state.type === "IDLE") {
			dispatch({
				type: "START_MOVING",
				pos: { x: e.clientX, y: e.clientY }
			});
		}
	}

	function updatePos(e: globalThis.MouseEvent) {
		// e.preventDefault();
		// e.stopPropagation();

		dispatch({
			type: "MOVE_MOUSE",
			pos: { x: e.clientX, y: e.clientY }
		});
	}

	function getMinRectangleX(
		origin: Position,
		outerPoint: Position,
		aspectRatio: number,
		scale: number = 1.05
	): number {
		// TODO: Fix it so that negative and positive amounts both work
		const widthFromX = outerPoint.x - origin.x;
		const yDiff = outerPoint.y - origin.y;

		// Use the y diff to get the x diff at that value
		const widthFromY = yDiff * aspectRatio;

		// If negative, return the smaller of the 2

		// If positive, return the larger of the 2

		if (widthFromY > widthFromX) {
			return widthFromY * scale;
		} else return widthFromX * scale;
	}

	function clickReleased(e: globalThis.MouseEvent) {
		e.preventDefault();
		e.stopPropagation();

		console.debug("Click released");

		dispatch({ type: "CLICK_RELEASED" });
	}

	useEffect(() => {
		setLocalVals({
			x: state.pos.x,
			y: state.pos.y,
			width: state.details.width
		});
	}, [state.pos.x, state.pos.y, state.details.width]);

	useEffect(fetchAspectRatio, []);

	const tempWidth =
		state.type === "DRAGGING" &&
		state.details.aspectRatio
			? getMinRectangleX(
					state.pos,
					state.dragTo,
					state.details.aspectRatio
				)
			: state.scaledWidth;

	const scale: number = tempWidth / state.details.width;

	// console.debug("scale: ", scale);

	return (
		<>
			<div
				{...args}
				className={`resizable-element ${minimized ? "resizable-minimized" : ""}`}
				id={id}
				onMouseUp={
					clickReleased as any as MouseEventHandler<HTMLDivElement>
				}
				onMouseLeave={
					clickReleased as any as MouseEventHandler<HTMLDivElement>
				}
				style={{
					width: state.details.width ?? undefined,
					// width:

					color: color,

					left: `${state.pos.x + (state.type === "MOVING" ? state.moveTo.x - state.moveFrom.x : 0)}px`,
					top: `${state.pos.y + (state.type === "MOVING" ? state.moveTo.y - state.moveFrom.y : 0)}px`,

					aspectRatio: state.details.aspectRatio,
					flexDirection:
						orientation === "Horizontal"
							? "row"
							: "column",

					// Scale based on the difference between state.details.width, and state.width
					transform: state.details
						? `scale(${scale})`
						: undefined,
					// (state.type === "DRAGGING" &&
					// state.aspectRatio
					// 	? getMinRectangleX(
					// 			state.pos,
					// 			state.dragTo,
					// 			state.aspectRatio
					// 		)
					// 	: state.scaledWidth)

					transformOrigin: "0 0",
					display: "inline-flex"
				}}
				// onLoad={fetchAspectRatio}
			>
				<div
					className="resizable-element-top-tab"
					onMouseDown={startMoving}
				/>

				{children}

				<div
					className="resizable-element-handle"
					// Start capturing when the user clicks on the handle
					onMouseDown={startResize}
				/>
			</div>
		</>
	);
}
export default Resizable;
