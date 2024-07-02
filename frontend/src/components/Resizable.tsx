import { Position } from "../../../backend/src/dataViews";
import { Color } from "../utils";
import "./Resizable.css";

import {
	MouseEvent,
	PropsWithChildren,
	useEffect,
	useReducer,
	useRef
} from "react";

let resizableElementId = 1;

interface BaseResizeState {
	width: number;
	aspectRatio: number | undefined;
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
	| { type: "SET_ASPECT_RATIO"; aspectRatio: number };

interface ResizableProps
	extends React.HTMLAttributes<HTMLDivElement> {
	defaultWidth: number;
	defaultPosition?: Position;
	color?: Color;
}
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
		...args
	} = props;

	const [state, dispatch] = useReducer(
		(
			state: ResizableState,
			action: ResizableAction
		): ResizableState => {
			// console.debug("Received action:", action);

			if (action.type === "SET_ASPECT_RATIO")
				return {
					...state,
					aspectRatio: action.aspectRatio
				};

			switch (state.type) {
				case "IDLE": {
					switch (action.type) {
						case "START_RESIZE": {
							// const startPos = {
							// 	x:
							// 		action.pos.x -
							// 		state.width,
							// 	y:
							// 		(action.pos.y -
							// 			state.width) /
							// 		(state.aspectRatio ?? 1)
							// };
							// addEventListeners();

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
							return {
								...state,
								type: "IDLE",
								width: state.aspectRatio
									? getMinRectangleX(
											state.pos,
											state.dragTo,
											state.aspectRatio
										)
									: state.width
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
							return {
								...state,
								type: "IDLE",
								pos: {
									x:
										state.moveTo.x -
										state.moveFrom.x +
										state.pos.x,

									y:
										state.moveTo.y -
										state.moveFrom.y +
										state.pos.y
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
			width: defaultWidth,
			pos: {
				x: defaultPosition?.x ?? 0,
				y: defaultPosition?.y ?? 0
			},
			aspectRatio: undefined
		}
	);

	const id = useRef(
		props.id ??
			`resizable-element-${resizableElementId++}`
	);

	function fetchAspectRatio() {
		if (!state || state.aspectRatio !== undefined)
			return;

		const element = document.getElementById(id.current);
		if (!element)
			throw new Error(
				`Unable to find resizable element by id ${id.current}.`
			);

		const { width, height } =
			element.getBoundingClientRect();

		dispatch({
			type: "SET_ASPECT_RATIO",
			aspectRatio: width / height
		});
	}

	function addEventListeners() {
		document.body.addEventListener(
			"mousemove",
			updatePos
		);

		document.body.addEventListener(
			"mouseup",
			clickReleased
		);
	}

	function removeEventListeners() {
		document.body.removeEventListener(
			"mousemove",
			updatePos
		);

		document.body.removeEventListener(
			"mouseup",
			clickReleased
		);
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
		dispatch({
			type: "MOVE_MOUSE",
			pos: { x: e.clientX, y: e.clientY }
		});
	}

	function getMinRectangleX(
		origin: Position,
		outerPoint: Position,
		aspectRatio: number
	): number {
		// TODO: Fix it so that negative and positive amounts both work
		const widthFromX = outerPoint.x - origin.x;
		const yDiff = outerPoint.y - origin.y;

		// Use the y diff to get the x diff at that value
		const widthFromY = yDiff * aspectRatio;

		// If negative, return the smaller of the 2

		// If positive, return the larger of the 2

		if (widthFromY > widthFromX) {
			return widthFromY;
		} else return widthFromX;
	}

	function clickReleased(e: globalThis.MouseEvent) {
		e.preventDefault();

		dispatch({ type: "CLICK_RELEASED" });

		// console.debug(
		// 	"Stopped capturing, but the user was never dragging."
		// );

		// console.log(
		// 	"start pos: ",
		// 	startPos,
		// 	"temp pos: ",
		// 	tempPos
		// );

		// // Update if we can
		// if (startPos) {
		// 	const newPos: Position = {
		// 		x: e.clientX,
		// 		y: e.clientY
		// 	};

		// 	const newWidth = getMinRectangleX(
		// 		startPos,
		// 		newPos
		// 	);

		// 	// const newWidth = width + diff;
		// 	console.debug(
		// 		`Updating resizable element ${id.current} from ${width} to ${newWidth}.`
		// 	);

		// 	setWidth(newWidth);

		// 	setStartPos(undefined);
		// 	setTempPos(undefined);

		// 	capturing.current = false;
	}

	useEffect(() => {
		console.debug(
			"Reducer state: ",
			JSON.stringify(state)
		);
	}, [state, state.type]);

	return (
		<>
			<div
				{...args}
				className="resizable-element"
				id={id.current}
				style={{
					width:
						state.type === "DRAGGING" &&
						state.aspectRatio
							? getMinRectangleX(
									state.pos,
									state.dragTo,
									state.aspectRatio
								)
							: state.width,
					color: color,

					left: `${state.pos.x + (state.type === "MOVING" ? state.moveTo.x - state.moveFrom.x : 0)}px`,
					top: `${state.pos.y + (state.type === "MOVING" ? state.moveTo.y - state.moveFrom.y : 0)}px`,

					aspectRatio: state.aspectRatio
				}}
				onLoad={fetchAspectRatio}
			>
				<div
					style={{
						width: "100%",
						height: "1em",
						backgroundColor: "white",
						position: "absolute",
						// Fix to be in css instead
						top: "-1em",
						zIndex: 2
					}}
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
