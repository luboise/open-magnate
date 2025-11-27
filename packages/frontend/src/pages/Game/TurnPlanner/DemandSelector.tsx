import { DemandType } from "magnate-core/game";
import GameDemandTile from "../GlobalUI/DemandPreview";

type Props = {
	demands: DemandType[];
	onDemandClicked: (
		demand: DemandType
	) => void | Promise<void>;
};

function DemandSelector({
	demands,
	onDemandClicked
}: Props) {
	return (
		<div className="demand-selector">
			{...demands.map((demand) => (
				<GameDemandTile
					demand={demand}
					onClick={() => onDemandClicked(demand)}
				/>
			))}
		</div>
	);
}

export default DemandSelector;
