import FormInput from "../../global_components/Form/FormInput";
import "./PageAuthForm.css";

function PageAuthForm() {
	return (
		<div id="page-authform">
			<form>
				<h2>Please enter a username</h2>
				<h3>
					This name will be shown to other
					players.
				</h3>
				<FormInput name="name" />
			</form>
		</div>
	);
}

export default PageAuthForm;
