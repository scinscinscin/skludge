import axios from "axios";
import React from "react";
import Header from "./components/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

interface User {
	username: string;
	uuid: string;
}

export type UseStateReturn<S> = [S, React.Dispatch<React.SetStateAction<S>>];
export const UserProvider = React.createContext<UseStateReturn<User | null>>(undefined as any);

function App() {
	const [user, setUser] = React.useState<User | null>(null);

	// Check if the user is logged in
	React.useEffect(() => {
		axios
			.get("/user/get")
			.then((res) => {
				if (res.data.success !== false) {
					setUser(res.data);
				}
			})
			.catch(() => {
				setUser(null);
			});
	}, []);

	return (
		<UserProvider.Provider value={[user, setUser]}>
			<BrowserRouter>
				<Header />

				{/* Render everything inside the main container, but only render hidden pages when the user is logged in */}
				<main className="container">
					{user === null ? (
						<Home />
					) : (
						<Routes>
							<Route path="/" element={<Dashboard />} />
						</Routes>
					)}
				</main>
			</BrowserRouter>
		</UserProvider.Provider>
	);
}

export default App;
