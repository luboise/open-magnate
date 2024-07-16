import { Position } from "../../../backend/src/dataViews";
import useLocalVal from "../hooks/useLocalVal";
import usePanning from "../hooks/usePanning";
import { Colour, GetReactChildId } from "../utils";
import "./Resizable.css";

import React, {
	PropsWithChildren,
	useEffect,
	useMemo,
	useReducer
} from "react";

interface BaseResizeState {}

interface IdleState extends BaseResizeState {
	type: "IDLE";
}
interface DraggingState extends BaseResizeState {
	type: "DRAGGING";
	startWidth: number;
}

type ResizableState = IdleState | DraggingState;

type ResizableAction =
	| {
			type: "START_RESIZE";
			startWidth: number;
			startPos: Position;
	  }
	| { type: "STOP_RESIZE" };

interface ResizableProps
	extends React.HTMLAttributes<HTMLDivElement> {
	defaultWidth?: number;
	orientation?: "Horizontal" | "Vertical";
	defaultPosition?: Position;
	colour?: Colour;
	minimiseIf?: boolean;
	scalingType?: "DIMENSIONS" | "SCALE";
}

function Resizable({
	defaultWidth = 700,
	orientation,
	defaultPosition,
	colour = "#000000",
	minimiseIf: minimised,
	scalingType = "SCALE",
	children,
	...args
}: PropsWithChildren<ResizableProps>) {
	const childId = useMemo(() => {
		return GetReactChildId(children);
	}, [children]);

	if (!childId)
		throw new Error(
			"Unable to find an id in the child component of a Resizeable component"
		);

	// console.debug(localVals);

	const parentId = "rz-" + childId;

	const { offset: panOffset, startPanning } = usePanning(
		parentId + "-offset",
		"LEFT",
		onScaleStop
	);

	const {
		offset: scaleOffset,
		startPanning: startScaling,
		resetOffset: resetScalingOffset
	} = usePanning(parentId + "-scaling", "LEFT");

	const [scale, setScale] = useLocalVal<number>(
		`${parentId}-scale-value`
	);

	function calculateScale(
		currentScale: number,
		currentWidth: number,
		currentOffset: Position
	): number {
		const xDiff = currentOffset.x;
		const currentWidthScaled =
			currentWidth * currentScale;

		const newScale =
			(currentWidthScaled + xDiff) /
			currentWidthScaled;

		return newScale;
	}

	const [state, dispatch] = useReducer(
		(
			state: ResizableState,
			action: ResizableAction
		): ResizableState => {
			if (
				state.type === "IDLE" &&
				action.type === "START_RESIZE"
			) {
				return {
					...state,
					type: "DRAGGING",
					startWidth: action.startWidth
				};
			} else if (
				state.type === "DRAGGING" &&
				action.type === "STOP_RESIZE"
			) {
				if (!scale)
					throw new Error(
						"Scale is undefined in resizable component."
					);

				const newScale = calculateScale(
					scale,
					state.startWidth,
					scaleOffset
				);

				setScale(newScale);
			}
			return state;
			// throw new Error(
			// 	`Invalid state action combination: State: ${state} Action: ${action}`
			// );
		},
		{
			type: "IDLE"
		}
	);

	function getDivDetails() {
		const element = document.getElementById(childId);
		if (!element)
			throw new Error(
				`Unable to find child element by id ${childId}.`
			);

		const { width, height } =
			element.getBoundingClientRect();

		const newDetails = {
			width,
			height
		};

		return newDetails;
	}

	function onScaleStart(
		event: React.MouseEvent<HTMLDivElement, MouseEvent>
	) {
		const div = getDivDetails();
		dispatch({
			type: "START_RESIZE",
			startPos: {
				x: event.clientX,
				y: event.clientY
			},
			startWidth: div.width
		});
	}

	function onScaleStop() {
		dispatch({ type: "STOP_RESIZE" });
		resetScalingOffset;
	}

	const currentScale: number =
		state.type === "DRAGGING"
			? calculateScale(
					scale ?? 1,
					state.startWidth,
					scaleOffset
				)
			: scale ?? 1;

	const styleProperties: React.CSSProperties = {
		left: panOffset.x,
		top: panOffset.y,

		scale:
			scalingType === "SCALE"
				? String(currentScale)
				: undefined
		// width:
		// 	scalingType === "DIMENSIONS"
		// 		? `${Math.floor(currentScale * 100)}%`
		// 		: undefined,
		// height:
		// 	scalingType === "DIMENSIONS"
		// 		? `${Math.floor(currentScale * 100)}%`
		// 		: undefined
		// transform:
		// 	scalingType === "DIMENSIONS"
		// 		? `scaleX(${currentScale}) scaleY(${currentScale})`
		// 		: undefined
	};

	const div = document.getElementById(childId);

	if (scalingType === "DIMENSIONS" && div) {
		const percentage = `${Math.floor(currentScale * 100)}%`;

		console.debug(percentage);

		div.style.width = percentage;
		div.style.height = percentage;
	}

	// console.debug(styleProperties);

	useEffect(resetScalingOffset, []);

	return (
		<>
			<div
				{...args}
				className={`resizable-element ${minimised ? "resizable-minimised" : ""}`}
				id={parentId}
				style={{
					borderColor: colour,

					flexDirection:
						orientation === "Horizontal"
							? "row"
							: "column",

					...styleProperties,

					transformOrigin: "0 0",
					display: "inline-flex"
				}}
				// onLoad={fetchAspectRatio}
			>
				<div
					className="resizable-element-top-tab"
					onMouseDown={(event) =>
						startPanning(
							event as unknown as MouseEvent
						)
					}
				/>

				{children}

				<div
					className="resizable-element-handle"
					// Start capturing when the user clicks on the handle
					onMouseDown={(event) => {
						startScaling(
							event as unknown as MouseEvent
						);
						onScaleStart(event);
					}}
				/>
			</div>
		</>
	);
}
export default Resizable;

