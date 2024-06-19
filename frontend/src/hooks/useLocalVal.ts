import { useState } from "react";
import { useLocalStorage } from "./useLocalStorage";

function useLocalVal<T extends Object>(
	localStorageKey: string
): [data: T | null, setter: (newVal: T | null) => void] {
	const { get, set, deleteFromLS } = useLocalStorage();

	const [val, setVal] = useState<T | null>(getter());

	function setter(newVal: T | null) {
		if (newVal === null) {
			deleteFromLS(localStorageKey);
			setVal(null);
			return;
		}

		set(localStorageKey, newVal);
		setVal({ ...newVal });
	}

	function getter(): T | null {
		const readVal = get(localStorageKey) as T;
		return readVal || null;
	}

	return [val, setter];
}

export default useLocalVal;
