import {
	Clamp,
	MapTile,
	Position,
	Rotation
} from "magnate-core";

import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";
import { useBoardInfo } from "./useMap";
import useMapTileInteraction from "./useMapTileInteraction";

interface BaseClientState {
	placing: MapTile | null;
	placementStatus: "PLACING" | "SUCCESS" | "FAILED";
}

interface ClientStateFailed extends BaseClientState {
	placing: MapTile | null;
	placementStatus: "FAILED";
}

interface ClientStateSuccessful extends BaseClientState {
	placing: MapTile;
	placementStatus: "SUCCESS";
}

interface ClientStatePlacing extends BaseClientState {
	placing: MapTile;
	placementStatus: "PLACING";
}

type ClientState =
	| ClientStateSuccessful
	| ClientStatePlacing
	| ClientStateFailed;

const clientStateAtom = atom<ClientState>({
	key: "CLIENT_STATE",
	default: {
		placing: null,
		placementStatus: "FAILED"
	}
});

export type OnTilePlacedCallback = (
	placed: MapTile
) => void | Promise<void>;

function useClientState(
	onTilePlaced?: OnTilePlacedCallback
) {
	const [clientState, setClientState] =
		useRecoilState(clientStateAtom);

	const { hovering } = useMapTileInteraction();

	const boardInfo = useBoardInfo();

	function startPlacing(tile: MapTile) {
		console.log("Beginning placement of tile ", tile);
		setClientState({
			...clientState,
			placing: tile,
			placementStatus: "PLACING"
		});
	}

	function commitPlacement() {
		// TODO: Put the placement logic here
		if (
			clientState.placing === null ||
			clientState.placementStatus !== "PLACING"
		) {
			return;
		}

		setClientState({
			...clientState,
			placementStatus: "SUCCESS",
			placing: clientState.placing
		});
	}

	interface UpdateProps {
		position?: Position;
		rotation?: Rotation;
	}

	function updatePlacement({
		position,
		rotation
	}: UpdateProps) {
		if (clientState.placementStatus !== "PLACING") {
			return;
		}

		const updatedPlacement: MapTile = {
			...clientState.placing,
			position:
				position ?? clientState.placing.position,
			rotation:
				rotation ?? clientState.placing.rotation
		} as MapTile;

		setClientState({
			...clientState,
			placing: updatedPlacement
		});
	}

	function rotatePlacement(
		direction: "FORWARDS" | "BACKWARDS" = "FORWARDS"
	) {
		if (
			clientState.placing === null ||
			clientState.placementStatus !== "PLACING"
		) {
			console.debug(
				"Unable to rotate null placement tile. Skipping."
			);
			return;
		}

		const tile = clientState.placing;

		setClientState({
			...clientState,
			placing: {
				...tile,
				rotation: ((tile.rotation +
					(direction === "FORWARDS" ? 90 : -90)) %
					360) as Rotation
			} as MapTile
			// TODO: Remove this as and fix the typing
		});
	}

	useEffect(() => {
		if (clientState.placementStatus === "SUCCESS") {
			onTilePlaced &&
				onTilePlaced(clientState.placing);
		}
	}, [clientState.placementStatus]);

	useEffect(() => {
		if (!hovering || clientState.placing === null)
			return;

		setClientState({
			...clientState,
			placing: {
				...clientState.placing,
				position: Position(
					Clamp(
						hovering.pos.x,
						0,
						boardInfo.width - 2,
						true
					),
					Clamp(
						hovering.pos.y,
						0,
						boardInfo.height - 2,
						true
					)
				)
			}
		});
	}, [hovering]);

	return {
		currentlyPlacingTile: Boolean(
			clientState.placementStatus === "PLACING"
		),
		tileBeingPlaced: clientState.placing,
		startPlacing,
		commitPlacement,
		updatePlacement,
		rotatePlacement
	};
}

export default useClientState;
