import "./App.css";

import { RecoilRoot } from "recoil";

import {
	BrowserRouter,
	Link,
	Route,
	Routes
} from "react-router-dom";
// import PageAllMapPieces from "./pages/PageAllMapPieces";
import PageGame from "./pages/PageGame";
import PageHomepage from "./pages/PageHomepage";
import { FrontendRoutes } from "./utils";

function App() {
	// const { localSession } = createLocalSession();

	// if (!localSession) {
	// 	return (
	// 		<RecoilRoot>
	// 			<AuthForm />
	// 		</RecoilRoot>
	// 	);
	// }

	return (
		<RecoilRoot>
			<h1>Open Magnate</h1>
			<BrowserRouter>
				<Routes>
					<Route
						path={FrontendRoutes.HOME}
						element={<PageHomepage />}
					/>
					{/* <Route
						path="/alltiles"
						element={<PageAllMapPieces />}
					/> */}
					{/* <Route
						path={FrontendRoutes.PLAY}
						element={<PagePlay />}
					/> */}
					<Route
						path={FrontendRoutes.PLAY}
						element={<PageGame />}
					/>
					<Route
						path="*"
						element={
							<>
								<p>
									This page could not be
									found. Click below to
									return to the homepage.
								</p>
								<Link
									to={FrontendRoutes.HOME}
								>
									<button>Return</button>
								</Link>
							</>
						}
					/>
				</Routes>
			</BrowserRouter>
		</RecoilRoot>
	);
}

export default App;
