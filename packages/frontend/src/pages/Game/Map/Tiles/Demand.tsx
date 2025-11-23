import "./Demand.css";

import { DemandType } from "magnate-core/demand/Supply";
import { ImgHTMLAttributes } from "react";
import Image from "../../../../global_components/Image";

interface Props
	extends ImgHTMLAttributes<HTMLImageElement> {
	demand: DemandType;
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

