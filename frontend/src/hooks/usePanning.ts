import React, {
	useCallback,
	useEffect,
	useMemo,
	useReducer
} from "react";
import { Position } from "../utils";
import useLocalVal from "./useLocalVal";

interface PanningState {
	buttonIsDown: boolean;
	panCursorStart: Position | null;
	offset: Position;

	panCursorCurrentPos: Position;
}

type MouseDownAction =
	| {
			actionType: "PRESSED" | "MOVED";
			pos: Position;
	  }
	| { actionType: "RELEASED" | "RESET_OFFSET" };

type MouseEventType = globalThis.MouseEvent;

function calculateOffset(
	actualPos: Position,
	panStart: Position,
	panCurrent: Position
): Position {
	// Fallback to the current position if not currently panning
	if (!panStart) return { ...actualPos };

	return {
		x: panCurrent.x - panStart.x + actualPos.x,
		y: panCurrent.y - panStart.y + actualPos.y
	};
}

function usePanning(
	identifier: string,
	panningType: "LEFT" | "RIGHT",
	onStopPanning?: () => void
) {
	if (!identifier)
		throw new Error(
			"A Pan ID is required when using usePanning()."
		);

	const panId = useMemo(() => {
		return `panning-options-${identifier}-${panningType}`;
	}, [identifier, panningType]);

	const [panningOptions, setPanningOptions] =
		useLocalVal<{
			offset: Position;
		}>(`panning-options-${panId}-${panningType}`);

	const [state, dispatch] = useReducer(
		(
			state: PanningState,
			action: MouseDownAction
		): PanningState => {
			switch (action.actionType) {
				case "MOVED": {
					if (!state.buttonIsDown) return state;

					// console.debug(
					// 	"MOVING IT: ",
					// 	action.pos
					// );
					return {
						...state,
						panCursorCurrentPos: {
							...action.pos
						}
					};
				}
				case "PRESSED": {
					// If new press event starts, just update the existing one's position
					if (state.buttonIsDown)
						return {
							...state,
							panCursorCurrentPos: action.pos
						};

					return {
						...state,
						buttonIsDown: true,
						panCursorStart: action.pos,
						panCursorCurrentPos: action.pos
					};
				}
				case "RELEASED": {
					if (
						!state.buttonIsDown ||
						!state.panCursorStart
					)
						return { ...state };

					if (onStopPanning)
						(async () => {
							onStopPanning;
						})();

					return {
						...state,
						buttonIsDown: false,
						offset: calculateOffset(
							state.offset,
							state.panCursorStart,
							state.panCursorCurrentPos
						)
					};
				}
				case "RESET_OFFSET": {
					return {
						...state,
						offset: { x: 0, y: 0 }
					};
				}

				default:
					return state;
			}
		},

		{
			buttonIsDown: false,
			panCursorStart: null,
			offset: panningOptions?.offset ?? {
				x: 0,
				y: 0
			},
			panCursorCurrentPos: { x: 0, y: 0 }
		}
	);

	const onMouseEvent = useCallback(
		(
			event: React.MouseEvent | globalThis.MouseEvent
		) => {
			const {
				type,
				button,
				clientX: x,
				clientY: y
			} = event;
			const pos = { x, y };

			if (type === "mousemove") {
				dispatch({ actionType: "MOVED", pos });
				return;
			}

			// Ignore irrelevant presses
			if (
				(panningType === "LEFT" && button !== 0) ||
				(panningType === "RIGHT" && button !== 2)
			)
				return;

			if (type === "mousedown") {
				console.debug(
					"Pan started: ",
					"Current state: ",
					state,
					"Position: ",
					pos
				);

				event.preventDefault();
				event.stopPropagation();
				dispatch({ actionType: "PRESSED", pos });
			} else if (type === "mouseup") {
				event.preventDefault();
				event.stopPropagation();
				dispatch({ actionType: "RELEASED" });
			} else {
				console.debug("Dropped");
			}
		},
		[]
	);

	const resetOffset = useCallback(() => {
		dispatch({ actionType: "RESET_OFFSET" });
	}, []);

	useEffect(() => {
		document.body.addEventListener(
			"mouseup",
			onMouseEvent
			// true
		);
		document.body.addEventListener(
			"mousemove",
			onMouseEvent
		);

		return () => {
			document.body.removeEventListener(
				"mouseup",
				onMouseEvent
			);
			document.body.removeEventListener(
				"mousemove",
				onMouseEvent
			);
		};
	}, []);

	useEffect(() => {
		setPanningOptions({
			offset: state.offset
		});
	}, [state.offset.x, state.offset.y]);

	function startPanning(event: MouseEventType) {
		onMouseEvent(event);
	}

	return {
		startPanning,
		offset:
			state.buttonIsDown && state.panCursorStart
				? calculateOffset(
						state.offset,
						state.panCursorStart,
						state.panCursorCurrentPos
					)
				: state.offset,
		resetOffset
	};
}

export default usePanning;

