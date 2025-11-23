import Button from "./Button";
import "./CustomPanel.css";

import { HTMLAttributes, PropsWithChildren } from "react";

interface CustomPanelProps
	extends PropsWithChildren<
		HTMLAttributes<HTMLDivElement>
	> {
	onClose: () => void;
}

function CustomPanel({
	children,
	onClose,
	className,
	...args
}: CustomPanelProps) {
	return (
		<div
			className={"modal-panel " + (className ?? "")}
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

export default CustomPanel;
