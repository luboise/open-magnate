import { useEffect, useState } from "react";
import { WEB_SOCKET_BASE_URL } from "./useAPI";

interface ConnectionParams {
	username: string;
}

interface WebSocketParams {
	url: string;
	onOpen?: () => void;
	onClose?: () => void;
	onMessage?: (msg: string) => void;
	connectionParams?: ConnectionParams;
	validator?: () => boolean;
}

function useWebSocket(params: WebSocketParams) {
	const [ws, setWs] = useState<WebSocket | null>(null);

	useEffect(() => {
		if (
			(params.validator && !params.validator()) ||
			ws !== null
		)
			return;

		const newWs = new WebSocket(
			`${WEB_SOCKET_BASE_URL}${params.url}`
		);

		newWs.addEventListener("open", (_event) => {
			if (params.onOpen) params.onOpen();
		});

		newWs.addEventListener("close", (_event) => {
			if (params.onClose) params.onClose();
		});

		newWs.addEventListener("message", (event) => {
			if (params.onMessage)
				params.onMessage(event.data);
		});

		console.debug("New web socket: ", newWs);

		setWs(newWs);
	}, [params.url, params.validator]);

	return { ws };
}

export default useWebSocket;
