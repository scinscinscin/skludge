import { Division } from "./entity/Division";
import { Task } from "./entity/Task";
import { User } from "./entity/User";

export const Cleanse = {
	user: function (user: User) {
		return {
			username: user.username,
			uuid: user.uuid,
			permissionLevel: user.permissionLevel,
		};
	},

	division: function (division: Division) {
		return {
			uuid: division.uuid,
			name: division.name,
			members: division.members.map(Cleanse.user),
		};
	},

	task: function (task: Task) {
		return {
			uuid: task.uuid,
			title: task.title,
			body: task.body,
			finished: task.finished,
		};
	},
};
