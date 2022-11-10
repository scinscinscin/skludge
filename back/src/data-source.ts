import "reflect-metadata";
import { DataSource } from "typeorm";
import { Task } from "./entity/Task";
import { User } from "./entity/User";

export const AppDataSource = new DataSource({
	type: "sqlite",
	database: "database.sqlite",
	synchronize: true,
	logging: false,
	entities: [User, Task],
	migrations: [],
	subscribers: [],
});
