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

	function initialiseState() {
		const readVal = get(localStorageKey) as T;

		if (!readVal && defaultValue) {
			setVal(defaultValue);
			return defaultValue;
		} else if (readVal) return readVal;
		else return null;
	}

	const initialValue = initialiseState();
	const [val, setVal] = useState<T | null>(initialValue);

	return [val, setter];
}

export default useLocalVal;
