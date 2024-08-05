import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";
import { MarketingTile } from "../../utils";

interface BaseClientState {
	placing: Placable | null;
	placementStatus: "PLACING" | "SUCCESS" | "FAILED";
}

interface ClientStateFailed extends BaseClientState {
	placing: Placable | null;
	placementStatus: "FAILED";
}

interface ClientStateSuccessful extends BaseClientState {
	placing: Placable;
	placementStatus: "SUCCESS";
}

interface ClientStatePlacing extends BaseClientState {
	placing: Placable;
	placementStatus: "PLACING";
}

type ClientState =
	| ClientStateSuccessful
	| ClientStatePlacing
	| ClientStateFailed;

type Placable = MarketingTile;

const clientStateAtom = atom<ClientState>({
	key: "CLIENT_STATE",
	default: {
		placing: null,
		placementStatus: "FAILED"
	}
});

interface Props {
	onTilePlaced: (
		placed: Placable
	) => void | Promise<void>;
}

function useClientState({ onTilePlaced }: Props) {
	const [clientState, setClientState] =
		useRecoilState(clientStateAtom);

	function startPlacing(toPlace: Placable) {
		setClientState({
			...clientState,
			placing: toPlace,
			placementStatus: "PLACING"
		});
	}

	function placeElement() {
		// TODO: Put the placement logic here
	}

	useEffect(() => {
		if (clientState.placementStatus === "SUCCESS") {
			onTilePlaced(clientState.placing);
		}
	}, [clientState.placementStatus]);

	return {};
}

export default useClientState;

