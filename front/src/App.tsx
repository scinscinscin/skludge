import axios from "axios";
import React from "react";
import Header from "./components/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TaskRouter from "./routes/TaskRouter";
import { NotificationEngine } from "./components/NotificationEngine";
import Manage from "./pages/Manage";

export interface User {
	permissionLevel: number;
	username: string;
	uuid: string;
}

export enum PERMISSION {
	ROOT = 100,
}

export type UseStateReturn<S> = [S, React.Dispatch<React.SetStateAction<S>>];
export const UserProvider = React.createContext<UseStateReturn<User | null>>(undefined as any);
export const NotifPrvider = React.createContext<NotificationEngine>(undefined as any);

function App() {
	const Notifier = NotificationEngine();
	const [user, setUser] = React.useState<User | null>(null);

	// Check if the user is logged in
	React.useEffect(fetchUser(setUser, Notifier), []);

	return (
		<UserProvider.Provider value={[user, setUser]}>
			<NotifPrvider.Provider value={Notifier}>
				<Notifier.Element />

				<BrowserRouter>
					<Header />

					<main className="container main">
						{user == null ? (
							<Routes>
								<Route path="/" element={<Home />} />
								<Route path="/login" element={<Login />} />
								<Route path="*" element={<h1>Not Found</h1>} />
							</Routes>
						) : (
							<Routes>
								<Route path="/task/*" element={TaskRouter} />
								<Route path="/" element={user.permissionLevel === PERMISSION.ROOT ? <Manage /> : <Dashboard />} />
								<Route path="*" element={<h1>Not Found (Internal)</h1>} />
							</Routes>
						)}
					</main>
				</BrowserRouter>
			</NotifPrvider.Provider>
		</UserProvider.Provider>
	);
}

function fetchUser(setUser: (user: User | null) => void, notifier: NotificationEngine) {
	return function () {
		axios
			.get("/user/getCurrentUser")
			.then((res) => {
				if (res.data.success !== false) {
					setUser(res.data);
				}
			})
			.catch(() => {
				setUser(null);
				notifier.notify({
					title: "Failed to fetch login status from the API",
				});
			});
	};
}

export default App;
