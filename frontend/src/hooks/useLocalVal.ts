import { useCallback, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";

function useLocalVal<T extends Object>(
	localStorageKey: string,
	defaultValue?: T
): [data: T | null, setter: (newVal: T | null) => void] {
	const { get, set, deleteFromLS } = useLocalStorage();

	const setter = useCallback(
		(newVal: T | null) => {
			if (newVal === null) {
				deleteFromLS(localStorageKey);
				setVal(null);
				return;
			}

			set(localStorageKey, newVal);

			setVal(
				typeof newVal === "string"
					? newVal
					: { ...newVal }
			);
		},
		[localStorageKey]
	);

	const getter = useCallback((): T | null => {
		const readVal = get(localStorageKey) as T;
		return readVal || null;
	}, [localStorageKey]);

	const [val, setVal] = useState<T | null>(getter());

	return [val, setter];
}

export default useLocalVal;
