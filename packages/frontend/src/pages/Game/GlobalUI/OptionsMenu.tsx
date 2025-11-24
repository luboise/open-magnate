import { useState } from "react";
import Button from "../../../global_components/Button";
import ModalPanel from "../../../global_components/ModalPanel";

interface Props {}

function OptionsMenu({}: Props) {
	const [inOptions, setInOptions] = useState(false);

	return (
		<div
			id="options-menu-background"
			className={inOptions ? "blurred" : ""}
			style={{ zIndex: 999 }}
		>
			{inOptions ? (
				<ModalPanel
					onClose={() => setInOptions(false)}
				>
					<div>option 1, option 2, option 3</div>
				</ModalPanel>
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

export default OptionsMenu;
