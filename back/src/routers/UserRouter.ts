import Router from "@koa/router";
import { pbkdf2Sync } from "pbkdf2";
import * as RT from "runtypes";
import { AppDataSource } from "../data-source";
import { PERMISSION, User } from "../entity/User";
import { validateBody } from "../middleware/validateBody";
import jwt from "jsonwebtoken";
import { loggedIn } from "../middleware/loggedIn";
import { Cleanse } from "../Cleanse";
import { DivisionRepository } from "./DivisionRouter";
import randomString from "crypto-random-string";
import { validatePermissions } from "../middleware/validatePermissions";

export const UserRouter = new Router();
export const UserRepository = AppDataSource.getRepository(User);
export const generatePassword = () => randomString({ length: 20, type: "hex" });
export const hash = (s: string) => pbkdf2Sync(s, process.env.SALT, 10, 128).toString("ascii");

const userCreateValidator = RT.Record({
	username: RT.String,
	divisionUUID: RT.String,
});

UserRouter.get("/get", loggedIn(), validatePermissions(PERMISSION.ADMIN), async (ctx) => {
	ctx.body = (await UserRepository.find()).map(Cleanse.user).filter((res) => res.permissionLevel != PERMISSION.ADMIN);
});

UserRouter.post("/create", loggedIn(), validateBody(userCreateValidator), async (ctx) => {
	const body = ctx.state.body as RT.Static<typeof userCreateValidator>;
	const division = await DivisionRepository.findOne({
		where: { uuid: body.divisionUUID },
		relations: { members: true },
	});

	if (division == null) throw new Error("Was not able to find a division with that uuid");

	const user = new User();
	const randomPassword = generatePassword();

	user.username = body.username;
	user.hashedPassword = hash(randomPassword);
	user.division = division;
	division.members.push(user);
	await AppDataSource.manager.save([user, division]);

	ctx.body = {
		user: Cleanse.user(user),
		division: Cleanse.division(division),
		password: randomPassword,
	};
});

const userLoginValidator = RT.Record({
	username: RT.String,
	password: RT.String,
});

UserRouter.post("/login", validateBody(userLoginValidator), async (ctx) => {
	const body = ctx.state.body as RT.Static<typeof userLoginValidator>;

	const user = await UserRepository.findOneBy({ username: body.username });
	if (user === null) throw new Error("Was unable to find a user with that username");

	if (user.hashedPassword !== hash(body.password)) throw new Error("Wrong password");

	const jwt_cookie = jwt.sign({ uuid: user.uuid }, process.env.JWT_SECRET);
	ctx.cookies.set("jwt", jwt_cookie);
	ctx.body = Cleanse.user(user);
});

UserRouter.post("/logout", async (ctx) => {
	ctx.cookies.set("jwt", "", { maxAge: 0 });
	ctx.body = { success: true };
});

UserRouter.get("/getCurrentUser", loggedIn(), async (ctx) => {
	ctx.body = Cleanse.user(ctx.state.user);
});

UserRouter.get("/:uuid", loggedIn(), async (ctx) => {
	const user = await UserRepository.findOneBy({ uuid: ctx.params.uuid });
	if (user == null) throw new Error("Was not able to find a user with that name");
	ctx.body = Cleanse.user(user);
});
