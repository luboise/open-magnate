import { useCallback } from "react";
import {
	atom,
	selector,
	useRecoilState,
	useRecoilValue
} from "recoil";

// Values in CSS vw
export const MIN_CARD_WIDTH = 5;
export const MAX_CARD_WIDTH = 20;

type ClientOptions = {
	employeeCardWidth: number;
};

const ClientOptionsAtom = atom<ClientOptions>({
	key: "CLIENT_OPTIONS",
	default: {
		employeeCardWidth: 5
	}
});

const CardWidthSelector = selector<number>({
	key: "CARD_WIDTH",
	get: ({ get }) => {
		return get(ClientOptionsAtom).employeeCardWidth;
	}
});

export function useSetClientOptions() {
	const [_options, setOptions] = useRecoilState(
		ClientOptionsAtom
	);

	const setOption = useCallback(
		<Option extends keyof ClientOptions>(
			option: Option,
			value: ClientOptions[Option]
		) => {
			if (option === "employeeCardWidth") {
				if (
					value < MIN_CARD_WIDTH ||
					value > MAX_CARD_WIDTH
				) {
					console.debug(
						`Invalid new card width received: ${value}`
					);
					return;
				}
			} else {
				console.debug(
					`Invalid option received: ${option} (value: ${value})`
				);
				return;
			}

			console.debug(`Updated ${option} to ${value}.`);
			// Set the value
			setOptions((old) => ({
				...old,
				[option]: value
			}));
		},

		[]
	);

	return setOption;
}

function useClientOptions() {
	const employeeCardWidth = useRecoilValue(
		CardWidthSelector
	);

	return {
		employeeCardWidth
	};
}

export default useClientOptions;
