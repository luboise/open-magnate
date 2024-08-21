import "./Demand.css";

import { ImgHTMLAttributes } from "react";
import Image from "../../../../global_components/Image";
import { DEMAND_TYPE } from "../../../../utils";

interface Props
	extends ImgHTMLAttributes<HTMLImageElement> {
	demand: DEMAND_TYPE;
}

function Demand({ demand, className, ...args }: Props) {
	return (
		<Image
			className={`demand-image ${className}`}
			url={`/resources/demand/${demand}.png`}
			{...args}
		/>
	);
}

export default Demand;
