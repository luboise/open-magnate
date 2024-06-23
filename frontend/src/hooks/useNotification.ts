function useNotification() {
	async function sendNotification(
		heading: string,
		text: string
	) {
		try {
			if (!("Notification" in window)) {
				console.debug(
					"This browser does not support desktop notifications"
				);
				return;
			}

			if (
				Notification.permission === "granted" ||
				(await Notification.requestPermission()) ===
					"granted"
			) {
				new Notification(heading, {
					body: text
				});

				return;
			}
		} catch (error) {
			console.error(error);
		}
	}

	return {
		sendNotification
	};
}

export default useNotification;
