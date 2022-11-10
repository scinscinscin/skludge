import axios from "axios";
import React from "react";
import { FieldValues, useForm } from "react-hook-form";
import ModalConstructor from "../components/ModalConstructor";
import "./Tasks.css";

export interface Task {
	title: string;
	body: string;
	uuid: string;
}

interface Props {
	tasks: Task[];
	setTasks: (newTasks: Task[]) => void;
}

function Tasks({ tasks, setTasks }: Props) {
	const { register, handleSubmit } = useForm();
	const createTaskModal = ModalConstructor();

	function createTask(formData: FieldValues) {
		axios
			.post("/task/create", formData)
			.then(({ data }) => {
				console.log(data);
				setTasks([...tasks, data]);
				createTaskModal.toggle();
			})
			.catch(() => {
				console.log("Failed to create that post. Please try again.");
			});
	}

	return (
		<div>
			<createTaskModal.Modal>
				<h1> Create a new task </h1>

				<form onSubmit={handleSubmit(createTask)}>
					<label>Title</label>
					<input {...register("title", { required: true })} placeholder="Enter title" />

					<label>Body</label>
					<input {...register("body")} placeholder="Enter body" />

					<button className="cool_button" type="submit">
						Create new Task
					</button>
				</form>
			</createTaskModal.Modal>

			<header className="tasks_header space_between">
				<h1>Tasks</h1>
				<button onClick={createTaskModal.toggle}>Create new task</button>
			</header>

			{tasks.length === 0 ? (
				<h2>There were no tasks found</h2>
			) : (
				<div className="tasksContainer">
					{tasks.map((task, index) => (
						<div className="task" key={index}>
							<h3>{task.title}</h3>
							<p>{task.body}</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export default Tasks;
