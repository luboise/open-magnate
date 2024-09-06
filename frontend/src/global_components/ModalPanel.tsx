import { HTMLAttributes, PropsWithChildren } from "react";
import CustomPanel from "./CustomPanel";
import "./ModalPanel.css";

interface Props
	extends PropsWithChildren<
		HTMLAttributes<HTMLDivElement>
	> {
	onClose: () => void | Promise<void>;
}

function ModalPanel({
	children,
	onClose,
	className,
	...args
}: Props) {
	return (
		<CustomPanel
			onClose={onClose}
			className={`centered ${className}`}
			{...args}
		>
			{children}
		</CustomPanel>
	);
}

export default ModalPanel;
