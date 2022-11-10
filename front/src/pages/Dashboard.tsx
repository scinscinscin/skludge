import axios from "axios";
import React from "react";
import { UserProvider } from "../App";
import Tasks, { Task } from "./Tasks";

function Dashboard() {
	const [user] = React.useContext(UserProvider);
	const [tasks, setTasks] = React.useState<Task[]>([]);

	React.useEffect(() => {
		axios
			.get("/task/authored")
			.then(({ data }) => {
				setTasks(data.tasks);
			})
			.catch(() => {
				console.log("Failed to reach tasks");
			});
	}, []);

	return (
		<div>
			<Tasks tasks={tasks} setTasks={setTasks} />
		</div>
	);
}

export default Dashboard;
