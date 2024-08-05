import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";
import { RotationAmount } from "../../../../shared/MapTiles/Tile";
import { Clamp } from "../../../../shared/utils";
import { MapOverlayTile, Position } from "../../utils";
import { useBoardInfo } from "./useMap";
import useMapTileInteraction from "./useMapTileInteraction";

interface BaseClientState {
	placing: MapOverlayTile | null;
	placementStatus: "PLACING" | "SUCCESS" | "FAILED";
}

interface ClientStateFailed extends BaseClientState {
	placing: MapOverlayTile | null;
	placementStatus: "FAILED";
}

interface ClientStateSuccessful extends BaseClientState {
	placing: MapOverlayTile;
	placementStatus: "SUCCESS";
}

interface ClientStatePlacing extends BaseClientState {
	placing: MapOverlayTile;
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
	placed: MapOverlayTile
) => void | Promise<void>;

function useClientState(
	onTilePlaced?: OnTilePlacedCallback
) {
	const [clientState, setClientState] =
		useRecoilState(clientStateAtom);

	const { hovering } = useMapTileInteraction();

	const boardInfo = useBoardInfo();

	function startPlacing(toPlace: MapOverlayTile) {
		setClientState({
			...clientState,
			placing: toPlace,
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
		pos?: Position;
		rotation?: RotationAmount;
	}

	function updatePlacement({
		pos,
		rotation
	}: UpdateProps) {
		if (clientState.placementStatus !== "PLACING") {
			return;
		}

		const updatedPlacement: MapOverlayTile = {
			...clientState.placing,
			pos: pos ?? clientState.placing.pos,
			rotation:
				rotation ?? clientState.placing.rotation
		};

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

		setClientState({
			...clientState,
			placing: {
				...clientState.placing,
				rotation: ((clientState.placing.rotation +
					(direction === "FORWARDS" ? 90 : -90)) %
					360) as RotationAmount
			}
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
				pos: {
					x: Clamp(
						hovering.pos.x,
						0,
						boardInfo.width - 2,
						true
					),
					y: Clamp(
						hovering.pos.y,
						0,
						boardInfo.height - 2,
						true
					)
				}
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

