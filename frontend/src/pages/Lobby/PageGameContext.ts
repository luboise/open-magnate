import { atom } from "recoil";
import { BackendMessage } from "../../utils";

type PageGameAtomObject = {
	sendMessage: (
		message: BackendMessage
	) => void | Promise<void>;
};

export const PageGameAtom = atom<PageGameAtomObject>({
	key: "PageGame",
	default: {
		sendMessage: (_message) => {
			throw new Error(
				"Attempted to send message to PageGame before it was initialized."
			);
		}
	}
	// default: false,
});
