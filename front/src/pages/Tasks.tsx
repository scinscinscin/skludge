import React from "react";
import { useNavigate } from "react-router-dom";
import { Task } from "./Dashboard";
import "./Tasks.css";

interface Props {
	tasks: Task[];
	setTasks: (newTasks: Task[]) => void;
}

function Tasks(props: Props) {
	const navigate = useNavigate();

	return (
		<>
			<header className="space_between">
				<h1>Tasks</h1>
				<button onClick={() => navigate("/task/create")}>Create Task</button>
			</header>
			{props.tasks.length == 0 ? (
				<h2>No Tasks Found</h2>
			) : (
				<div className="tasks_container">
					{props.tasks.map((task, i) => (
						<div className="task card" key={i}>
							<header className="space_between">
								<h2>{task.title}</h2>
								<i style={{ display: "none" }} className="fa fa-link" onClick={() => navigate(`/task/${task.uuid}`)}></i>
							</header>

							<section>
								<p>{task.body}</p>
							</section>
						</div>
					))}
				</div>
			)}
		</>
	);
}

export default Tasks;
