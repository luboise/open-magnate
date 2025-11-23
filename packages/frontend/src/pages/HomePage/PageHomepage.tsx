import { Link } from "react-router-dom";
import { FrontendRoutes } from "magnate-core/Routes";

function PageHomepage() {
	return <Link to={FrontendRoutes.PLAY}>Play</Link>;
}

export default PageHomepage;
