import Router from "@koa/router";
import * as RT from "runtypes";
import { loggedIn } from "../middleware/loggedIn";
import { validateBody } from "../middleware/validateBody";
import { AppDataSource } from "../src/data-source";
import { Task } from "../src/entity/Task";

const TaskRepository = AppDataSource.getRepository(Task);
export const TaskRouter = new Router();
const taskValidator = RT.Record({
	title: RT.String,
	body: RT.String,
});

TaskRouter.post("/create", loggedIn(), validateBody(taskValidator), async (ctx) => {
	const { user, body } = ctx.state;

	const newTask = new Task();
	newTask.author = user;
	newTask.title = body.title;
	newTask.body = body.body;
	await TaskRepository.save(newTask);

	ctx.body = {
		author: {
			uuid: newTask.author.uuid,
			username: newTask.author.username,
		},
		title: newTask.title,
		body: newTask.body,
		uuid: newTask.uuid,
	};
});

TaskRouter.get("/authored", loggedIn(), async (ctx) => {
	const tasks = await TaskRepository.findBy({ author: { uuid: ctx.state.user.uuid } });
	ctx.body = {
		tasks: tasks.map((task) => ({
			title: task.title,
			body: task.body,
			uuid: task.uuid,
		})),
	};
});
