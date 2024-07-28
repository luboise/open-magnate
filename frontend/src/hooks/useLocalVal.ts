import { useCallback, useEffect, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";

function useLocalVal<T extends Object | string | number>(
	localStorageKey: string,
	defaultValue?: T
): [data: T | null, setter: (newVal: T | null) => void] {
	const { get, set, deleteFromLS } = useLocalStorage();
	const [val, setVal] = useState<T | null>(
		(get(localStorageKey) as T) ?? null
	);

	const setter = useCallback(
		(newVal: T | null) => {
			if (newVal === null) {
				deleteFromLS(localStorageKey);

				setVal(null);
				return;
			}

			set(localStorageKey, newVal);

			setVal(
				typeof newVal === "object"
					? { ...newVal }
					: newVal
			);
		},
		[localStorageKey]
	);

	useEffect(() => {
		if (!val && defaultValue) {
			console.debug(
				`Setting default value for ${localStorageKey} to ${defaultValue}`
			);
			setter(defaultValue);
		}
	}, []);

	return [val, setter];
}

export default useLocalVal;
