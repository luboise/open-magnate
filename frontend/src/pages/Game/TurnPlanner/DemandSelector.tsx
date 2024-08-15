import { DEMAND_TYPE } from "../../../../../backend/src/dataViews";
import Demand from "../Map/Tiles/Demand";

type Props = {
	demands: DEMAND_TYPE[];
	onDemandClicked: (
		demand: DEMAND_TYPE
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
