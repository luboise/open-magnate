import useClientState from "../../../hooks/game/useClientState";

type Props = {};

function Placer({}: Props) {
	const { currentlyPlacingTile, tileBeingPlaced } =
		useClientState();

	const tile = currentlyPlacingTile
		? tileBeingPlaced
		: null;

	return <div>Placer</div>;
}

export default Placer;

