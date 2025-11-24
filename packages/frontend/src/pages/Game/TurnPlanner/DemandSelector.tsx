import { DemandType } from "magnate-core/demand";
import Demand from "../Map/Tiles/Demand";

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
				<Demand
					demand={demand}
					onClick={() => onDemandClicked(demand)}
				/>
			))}
		</div>
	);
}

export default DemandSelector;
