import { MapTile, Position, Rotation } from "magnate-core";

import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";

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

// For if the tile placer is using global state
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

	// const { hovering } = useMapTileInteraction();

	function startPlacing(tile: MapTile) {
		console.debug("Beginning placement of tile ", tile);

		setClientState({
			placing: tile,
			placementStatus: "PLACING"
		} satisfies ClientState);
	}

	function commitPlacement() {
		setClientState((oldState) => {
			// TODO: Put the placement logic here
			if (
				oldState.placing === null ||
				oldState.placementStatus !== "PLACING"
			) {
				return oldState;
			}

			return {
				placementStatus: "SUCCESS",
				placing: clientState.placing!
			} satisfies ClientState;
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
		setClientState((oldState) => {
			if (oldState.placementStatus !== "PLACING") {
				return oldState;
			}

			const updatedPlacement: MapTile = {
				...oldState.placing,
				position: position ?? {
					...oldState.placing.position
				},
				rotation:
					rotation ?? oldState.placing.rotation
			} as MapTile;

			return {
				...oldState,
				placing: updatedPlacement
			};
		});
	}

	function rotatePlacement(
		direction: "FORWARDS" | "BACKWARDS" = "FORWARDS"
	) {
		setClientState((oldState) => {
			if (
				oldState.placing === null ||
				oldState.placementStatus !== "PLACING"
			) {
				console.debug(
					"Unable to rotate null placement tile. Skipping."
				);
				return oldState;
			}

			const tile = oldState.placing;

			return {
				...oldState,
				placing: {
					...tile,
					rotation: ((tile.rotation +
						(direction === "FORWARDS"
							? 90
							: -90)) %
						360) as Rotation
				} as MapTile
			};
		});
	}

	useEffect(() => {
		if (clientState.placementStatus === "SUCCESS") {
			onTilePlaced &&
				onTilePlaced(clientState.placing);
		}
	}, [clientState.placementStatus]);

	return {
		currentlyPlacingTile: Boolean(
			clientState.placementStatus === "PLACING"
		),
		tileBeingPlaced: clientState.placing,
		clientState,
		startPlacing,
		commitPlacement,
		updatePlacement,
		rotatePlacement
	};
}

export default useClientState;
