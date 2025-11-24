import { FrontendRoutes } from "magnate-core/Routes";
import { Link } from "react-router-dom";

function PageHomepage() {
	return <Link to={FrontendRoutes.PLAY}>Play</Link>;
}

export default PageHomepage;
