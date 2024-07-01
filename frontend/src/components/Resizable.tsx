import { Color } from "../utils";
import "./Resizable.css";

import {
	MouseEvent,
	PropsWithChildren,
	useEffect,
	useReducer,
	useRef
} from "react";

interface ResizableProps {
	defaultWidth: number;
	color?: Color;
}

let resizableElementId = 1;

interface Position {
	x: number;
	y: number;
}

interface BaseResizeState {
	width: number;
	aspectRatio: number | undefined;
}

interface IdleState extends BaseResizeState {
	type: "IDLE";
}
interface DraggingState extends BaseResizeState {
	type: "DRAGGING";
	startPos: Position;
	currentPos: Position;
}

type ResizableState = IdleState | DraggingState;

type ResizableAction =
	| {
			type: "START_DRAG";
			pos: Position;
	  }
	| { type: "MOVE_MOUSE"; pos: Position }
	| { type: "STOP_DRAG" }
	| { type: "SET_ASPECT_RATIO"; aspectRatio: number };

function Resizable(
	props: PropsWithChildren<ResizableProps> = {
		// defaultHeight: 0,
		defaultWidth: 700,
		color: "#000000"
	}
) {
	const [state, dispatch] = useReducer(
		(
			state: ResizableState,
			action: ResizableAction
		): ResizableState => {
			console.debug("Received action:", action);

			if (action.type === "SET_ASPECT_RATIO")
				return {
					...state,
					aspectRatio: action.aspectRatio
				};

			switch (state.type) {
				case "IDLE": {
					switch (action.type) {
						case "START_DRAG": {
							const startPos = {
								x:
									action.pos.x -
									state.width,
								y:
									(action.pos.y -
										state.width) /
									(state.aspectRatio ?? 1)
							};
							// addEventListeners();

							return {
								...state,
								type: "DRAGGING",
								currentPos: action.pos,
								startPos: startPos
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
								currentPos: {
									...action.pos
								}
							};
						case "STOP_DRAG": {
							// removeEventListeners();

							return {
								...state,
								type: "IDLE",
								width: state.aspectRatio
									? getMinRectangleX(
											state.startPos,
											state.currentPos,
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
			}
		},
		{
			type: "IDLE",
			width: props.defaultWidth,
			aspectRatio: undefined
		}
	);

	const id = useRef(
		`resizable-element-${resizableElementId++}`
	);
	// const [height, setHeight] = useState(
	// 	props.defaultHeight
	// );

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
			stopCapturing
		);
	}

	function removeEventListeners() {
		document.body.removeEventListener(
			"mousemove",
			updatePos
		);

		document.body.removeEventListener(
			"mouseup",
			stopCapturing
		);
	}

	useEffect(() => {
		addEventListeners();

		return () => removeEventListeners();
	}, []);

	function startCapturing(e: MouseEvent) {
		e.preventDefault();

		if (state.type === "IDLE") {
			dispatch({
				type: "START_DRAG",
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
		const widthFromX = outerPoint.x - origin.x;
		const yDiff = outerPoint.y - origin.y;

		// Use the y diff to get the x diff at that value
		const widthFromY = yDiff * aspectRatio;

		if (widthFromY < widthFromX) {
			return widthFromY;
		} else return widthFromX;
	}

	function stopCapturing(e: globalThis.MouseEvent) {
		e.preventDefault();

		dispatch({ type: "STOP_DRAG" });

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
				className="resizable-element"
				id={id.current}
				style={{
					width:
						state.type === "DRAGGING"
							? getMinRectangleX(
									state.startPos,
									state.currentPos
								)
							: state.width,
					color: props.color,
					aspectRatio: state.aspectRatio
				}}
				onLoad={fetchAspectRatio}
			>
				{props.children}
				<div
					className="resizable-element-handle"
					// Start capturing when the user clicks on the handle
					onMouseDown={startCapturing}
				/>
			</div>
		</>
	);
}
export default Resizable;
