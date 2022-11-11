import axios from "axios";
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

	function toggleFinished(task: Task) {
		axios
			.patch("/task/edit/" + task.uuid, { finished: !task.finished })
			.then(({ data }) => {
				props.setTasks(props.tasks.map((t) => (t.uuid != task.uuid ? t : data)));
				console.log(data);
			})
			.catch();
	}

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
								<div className="icons">
									<i className="fa fa-link show_onhover" onClick={() => navigate(`/task/${task.uuid}`)}></i>
									<i
										className={"fa " + (task.finished ? "fa-check-square-o" : "fa-square-o")}
										onClick={() => toggleFinished(task)}
									></i>
								</div>
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
