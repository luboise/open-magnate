type FormProps<T> = { onSubmit: (data: T) => void };

function Form<T>(
	props: React.PropsWithChildren<FormProps<T>>
) {
	function onFormSubmit(
		event: React.FormEvent<HTMLFormElement>
	): void {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		props.onSubmit(data as T);
	}

	return (
		<form onSubmit={onFormSubmit}>
			{props.children}
		</form>
	);
}

export default Form;
