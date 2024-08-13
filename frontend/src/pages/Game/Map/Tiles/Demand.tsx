import "./Demand.css";

import { DEMAND_TYPE } from "../../../../../../backend/src/dataViews";
import Image from "../../../../global_components/Image";

type Props = {
	demand: DEMAND_TYPE;
};

function Demand({ demand }: Props) {
	return (
		<Image
			className="demand-image"
			url={`/resources/demand/${demand}.png`}
		/>
	);
}

export default Demand;
