import { useState } from "react";
import Button from "../../../global_components/Button";
import OptionsMenu from "./OptionsMenu";

interface Props {}

function OptionsMenuHandler({}: Props) {
	const [inOptions, setInOptions] = useState(false);

	return (
		<div
			id="options-menu-background"
			className={inOptions ? "blurred" : ""}
			style={{ zIndex: 999 }}
		>
			{inOptions ? (
				<OptionsMenu
					onClose={() => setInOptions(false)}
				/>
			) : (
				<Button
					className="corner-button"
					onClick={() =>
						setInOptions((old) => !old)
					}
				>
					⚙️
				</Button>
			)}
		</div>
	);
}

export default OptionsMenuHandler;
