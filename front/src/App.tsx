import axios from "axios";
import React from "react";
import Header from "./components/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TaskRouter from "./routes/TaskRouter";

export interface User {
	username: string;
	uuid: string;
}

export type UseStateReturn<S> = [S, React.Dispatch<React.SetStateAction<S>>];
export const UserProvider = React.createContext<UseStateReturn<User | null>>(undefined as any);

function App() {
	const [user, setUser] = React.useState<User | null>(null);

	// Check if the user is logged in
	React.useEffect(fetchUser(setUser), []);

	return (
		<UserProvider.Provider value={[user, setUser]}>
			<BrowserRouter>
				<Header />

				<main className="container">
					{user == null ? (
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/login" element={<Login />} />
							<Route path="*" element={<h1>Not Found</h1>} />
						</Routes>
					) : (
						<Routes>
							<Route path="/task/*" element={TaskRouter}></Route>
							<Route path="/" element={<Dashboard />} />
							<Route path="*" element={<h1>Not Found (Internal)</h1>} />
						</Routes>
					)}
				</main>
			</BrowserRouter>
		</UserProvider.Provider>
	);
}

function fetchUser(setUser: (user: User | null) => void) {
	return function () {
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
	};
}

export default App;
