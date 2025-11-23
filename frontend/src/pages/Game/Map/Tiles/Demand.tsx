import "./Demand.css";

import { ImgHTMLAttributes } from "react";
import Image from "../../../../global_components/Image";
import { DemandType } from "@shared/demand/Supply";

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
