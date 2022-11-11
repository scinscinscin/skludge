import Router from "@koa/router";
import * as RT from "runtypes";
import { validateBody } from "../middleware/validateBody";
import { AppDataSource } from "../src/data-source";
import { Task } from "../src/entity/Task";
import { User } from "../src/entity/User";

const TaskRepository = AppDataSource.getRepository(Task);
export const TaskRouter = new Router();
const taskValidator = RT.Record({
	title: RT.String,
	body: RT.String,
});

TaskRouter.post("/create", validateBody(taskValidator), async (ctx) => {
	const { user, body } = ctx.state;

	const newTask = new Task();
	newTask.author = user;
	newTask.title = body.title;
	newTask.body = body.body;
	await TaskRepository.save(newTask);

	ctx.body = {
		...cleanseTask(newTask),
		author: {
			uuid: newTask.author.uuid,
			username: newTask.author.username,
		},
	};
});

TaskRouter.get("/authored", async (ctx) => {
	const tasks = await TaskRepository.findBy({ author: { uuid: ctx.state.user.uuid } });
	ctx.body = {
		tasks: tasks.map(cleanseTask),
	};
});

TaskRouter.get("/:uuid", async (ctx) => {
	const { uuid } = ctx.params;
	const task = await TaskRepository.findOne({
		where: { uuid: uuid },
		relations: { author: true },
	});

	if (task == null) throw new Error("Was not able to find a task with that name");

	ctx.body = {
		...cleanseTask(task),
		author: {
			uuid: task.author.uuid,
			username: task.author.username,
		},
	};
});

const editTaskValidator = RT.Partial({
	title: RT.String,
	body: RT.String,
	finished: RT.Boolean,
});

TaskRouter.patch("/edit/:uuid", validateBody(editTaskValidator), async (ctx) => {
	const uuid = ctx.params.uuid;
	const { user, body }: { user: User; body: RT.Static<typeof editTaskValidator> } = ctx.state;

	const task = await TaskRepository.findOne({
		where: { uuid },
		relations: { author: true },
	});

	if (task.author.uuid != user.uuid) throw new Error("Only the task author can change it's content");
	if (body.body != null) task.body = body.body;
	if (body.title != null) task.title = body.title;
	if (body.finished != null) task.finished = body.finished;

	await TaskRepository.save(task);

	ctx.body = cleanseTask(task);
});

TaskRouter.delete("/delete/:uuid", async (ctx) => {
	const task = await TaskRepository.findOneOrFail({
		where: { uuid: ctx.params.uuid },
		relations: { author: true },
	});

	if (task.author.uuid !== ctx.state.user.uuid) throw new Error("Only the task author can remove their own task");
	await TaskRepository.remove(task);

	ctx.body = { success: true };
});

function cleanseTask(task: Task) {
	return {
		uuid: task.uuid,
		title: task.title,
		body: task.body,
		finished: task.finished,
	};
}
