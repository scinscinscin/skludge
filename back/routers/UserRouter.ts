import Router from "@koa/router";
import { pbkdf2Sync } from "pbkdf2";
import * as RT from "runtypes";
import { AppDataSource } from "../src/data-source";
import { User } from "../src/entity/User";
import { validateBody } from "../middleware/validateBody";
import jwt from "jsonwebtoken";
export const UserRouter = new Router();

const UserRepository = AppDataSource.getRepository(User);
const hash = (s: string) => pbkdf2Sync(s, process.env.SALT, 10, 128).toString("utf-8");

const userValidator = RT.Record({
	username: RT.String,
	password: RT.String,
});

UserRouter.post("/create", validateBody(userValidator), async (ctx) => {
	const body = ctx.state.body as RT.Static<typeof userValidator>;

	const user = new User();
	user.username = body.username;
	user.hashedPassword = hash(body.password);
	await AppDataSource.manager.save(user);

	ctx.body = await user.cleanse();
});

UserRouter.post("/login", validateBody(userValidator), async (ctx) => {
	const body = ctx.state.body as RT.Static<typeof userValidator>;

	const user = await UserRepository.findOneBy({ username: body.username });
	if (user === null) throw new Error("Was unable to find a user with that username");

	if (user.hashedPassword !== hash(body.password)) throw new Error("Wrong password");

	const jwt_cookie = jwt.sign({ uuid: user.uuid }, process.env.JWT_SALT);
	ctx.cookies.set("jwt", jwt_cookie);
	ctx.body = await user.cleanse();
});
