import axios from "axios";
import React from "react";
import Tasks from "./Tasks";

export interface Task {
	title: string;
	body: string;
	uuid: string;
}

function Dashboard() {
	const [tasks, setTasks] = React.useState<Task[]>([]);

	React.useEffect(() => {
		axios
			.get("/task/authored")
			.then(({ data }) => {
				setTasks(data.tasks);
			})
			.catch();
	}, []);

	return (
		<>
			<Tasks tasks={tasks} setTasks={setTasks} />
		</>
	);
}

export default Dashboard;
