import axios from "axios";
import { useEffect, useState } from "react";
import { FieldValue, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { Task } from "./Dashboard";
import { useNavigate } from "react-router-dom";

function TaskPage() {
	let { uuid } = useParams();
	const [task, setTask] = useState<Task | null>();
	const [isEditing, setIsEditing] = useState(false);
	const toggleEditForm = () => setIsEditing(!isEditing);
	const EditForm = useForm({});
	const navigate = useNavigate();

	useEffect(() => {
		axios
			.get(`/task/${uuid}`)
			.then(({ data }) => {
				setTask(data);
			})
			.catch();
	}, []);

	useEffect(() => {
		if (task != null) {
			EditForm.reset({
				title: task.title,
				body: task.body,
			});
		}
	}, [task]);

	function editForm(formData: FieldValue<{ title: string; body: string }>) {
		console.log(formData);
		axios
			.patch(`/task/edit/${task?.uuid}`, formData)
			.then(({ data }) => {
				console.log(data);
				setTask(data);
				toggleEditForm();
			})
			.catch();
	}

	function remove() {
		axios
			.delete(`/task/delete/${task?.uuid}`)
			.then(({ data }) => {
				if (data.success == true) {
					navigate("/");
				}
			})
			.catch();
	}

	if (task == null) return <h1>Loading...</h1>;

	return (
		<div className="task">
			<header className="space_between">
				<h1>{isEditing ? "Editing task" : task.title}</h1>
				<button className="darker" onClick={toggleEditForm}>
					{isEditing ? "Cancel Edit" : "Edit"}
				</button>
			</header>

			<section>
				{isEditing ? (
					<form onSubmit={EditForm.handleSubmit(editForm)}>
						<label>Title</label>
						<input {...EditForm.register("title", { required: true })} />

						<label>Body</label>
						<input {...EditForm.register("body", { required: true })} />

						<div className="space_between">
							<button type="submit" className="darker">
								Edit
							</button>

							<button type="button" onClick={remove} className="bad_button">
								Delete
							</button>
						</div>
					</form>
				) : (
					<p>{task.body}</p>
				)}
			</section>
		</div>
	);
}

export default TaskPage;
