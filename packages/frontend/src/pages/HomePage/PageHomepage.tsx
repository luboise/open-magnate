import { FrontendRoutes } from "magnate-core/networking";
import { Link } from "react-router-dom";

function PageHomepage() {
	return <Link to={FrontendRoutes.PLAY}>Play</Link>;
}

export default PageHomepage;
