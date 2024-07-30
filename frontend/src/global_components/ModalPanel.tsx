import Button from "./Button";
import "./ModalPanel.css";

import { HTMLAttributes, PropsWithChildren } from "react";

interface ModalPanelProps
	extends PropsWithChildren<
		HTMLAttributes<HTMLDivElement>
	> {
	onClose: () => void;
}

function ModalPanel({
	children,
	onClose,
	className,
	...args
}: ModalPanelProps) {
	return (
		<div
			className={"modal-panel " + className ?? ""}
			{...args}
		>
			<Button
				className="corner-button"
				onClick={onClose}
			>
				X
			</Button>
			{children}
		</div>
	);
}

export default ModalPanel;
