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
	const TaskCreateForm = useForm();
	const TaskEditForm = useForm();
	const [taskBeingEdited, setTaskBeingEdited] = React.useState<Task | null>(null);
	const createTaskModal = ModalConstructor();
	const editTaskModal = ModalConstructor();

	React.useEffect(() => {
		if (taskBeingEdited != null) {
			editTaskModal.setIsOpen(true);
			TaskEditForm.reset({
				title: taskBeingEdited.title,
				body: taskBeingEdited.body,
			});
		}
	}, [taskBeingEdited]);

	function createTask(formData: FieldValues) {
		axios
			.post("/task/create", formData)
			.then(({ data }) => {
				console.log(data);
				setTasks([...tasks, data]);
				TaskCreateForm.reset();
			})
			.catch(() => {
				console.log("Failed to create that post. Please try again.");
			});
	}

	function editTask(formData: FieldValues) {
		axios
			.patch(`/task/edit/${taskBeingEdited?.uuid}`, formData)
			.then(({ data }) => {
				setTasks(tasks.map((task) => (task.uuid != data.uuid ? task : data)));
				editTaskModal.toggle();
			})
			.catch();
		console.log(formData);
	}

	return (
		<div>
			<createTaskModal.Modal>
				<h1> Create a new task </h1>

				<form onSubmit={TaskCreateForm.handleSubmit(createTask)}>
					<label>Title</label>
					<input {...TaskCreateForm.register("title", { required: true })} />

					<label>Body</label>
					<input {...TaskCreateForm.register("body")} />

					<button className="cool_button" type="submit">
						Create new Task
					</button>
				</form>
			</createTaskModal.Modal>

			{taskBeingEdited != null && (
				<editTaskModal.Modal>
					<h1> You are currently editing {taskBeingEdited.title} </h1>
					<form onSubmit={TaskEditForm.handleSubmit(editTask)}>
						<label>Title</label>
						<input {...TaskEditForm.register("title", { required: true })} />

						<label>Body</label>
						<input {...TaskEditForm.register("body")} />
						<button className="cool_button" type="submit">
							Edit post
						</button>
					</form>
				</editTaskModal.Modal>
			)}

			<header className="tasks_header space_between">
				<h1>Tasks</h1>
				<button onClick={createTaskModal.toggle}>Create new task</button>
			</header>

			{tasks.length === 0 ? (
				<h2>There were no tasks found</h2>
			) : (
				<div className="tasksContainer">
					{tasks.map((task, index) => {
						return (
							<div className="task" key={index} onClick={() => setTaskBeingEdited(task)}>
								<h3>{task.title}</h3>
								<p>{task.body}</p>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}

export default Tasks;
