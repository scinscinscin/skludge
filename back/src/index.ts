import { AppDataSource } from "./data-source";
import Koa from "koa";
import Router from "@koa/router";
import KoaCors from "@koa/cors";
import KoaMorgan from "koa-morgan";
import { koaBody as KoaBody } from "koa-body";
import { hash, UserRepository, UserRouter } from "../routers/UserRouter";
import { errorHandler } from "../middleware/errorHandler";
import { responseTime } from "../middleware/responseTime";
import { Permissions, User } from "./entity/User";
import { TaskRouter } from "../routers/TaskRouter";

require("dotenv").config();

AppDataSource.initialize()
	.then(async () => {
		if ((await UserRepository.find()).length == 0) await initiializeDatabase();

		const server = new Koa();
		server.use(KoaCors({ credentials: true, origin: "http://localhost:5173" }));
		server.use(KoaBody());
		server.use(KoaMorgan("common"));
		server.use(responseTime);
		server.use(errorHandler);

		const MainRouter = new Router();
		const reg = (p: string, r: Router) => MainRouter.use(p, r.routes()).use(p, r.allowedMethods());

		reg("/user", UserRouter);
		reg("/task", TaskRouter);
		server.use(MainRouter.routes()).use(MainRouter.allowedMethods());

		server.listen(process.env.PORT ?? 11337, () => {
			console.log("Server has started on port", process.env.PORT);
		});
	})
	.catch((error) => console.log(error));

async function initiializeDatabase() {
	console.log("Initializing the database with the admin account");
	const user = new User();
	user.username = process.env.ADMIN_USERNAME;
	user.hashedPassword = hash(process.env.ADMIN_PASSWORD);
	user.permissionLevel = Permissions.ADMIN;

	await AppDataSource.manager.save(user);
}
