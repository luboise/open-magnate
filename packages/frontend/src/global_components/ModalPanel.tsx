import { PropsWithChildren } from "react";
import CustomPanel from "./CustomPanel";
import "./ModalPanel.css";

interface Props extends PropsWithChildren<{}> {
	onClose: () => void | Promise<void>;
}

function ModalPanel({ children, onClose }: Props) {
	return (
		<div className="modal-panel-container">
			<div className="modal-panel-background" />
			<CustomPanel
				onClose={onClose}
				className="centered"
			>
				{children}
			</CustomPanel>
		</div>
	);
}

export default ModalPanel;
