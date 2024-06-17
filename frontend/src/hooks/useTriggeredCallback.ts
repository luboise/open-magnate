import React, { useEffect } from "react";

function useTriggeredCallback(
	callbackFn: () => void | Promise<void>,
	initialState: boolean = false
): [callbackTrigger: () => void, value: boolean] {
	const [boolState, setBoolState] =
		React.useState<boolean>(initialState);
	const callback = React.useCallback(callbackFn, []);

	function triggerFunction() {
		setBoolState(true);
	}

	useEffect(() => {
		if (boolState) {
			callback();
			setBoolState(false);
		}
	}, [boolState]);

	return [triggerFunction, boolState];
}

export default useTriggeredCallback;
