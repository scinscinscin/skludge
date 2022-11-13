import Router from "@koa/router";
import * as RT from "runtypes";
import { Cleanse } from "../Cleanse";
import { AppDataSource } from "../data-source";
import { Division } from "../entity/Division";
import { PERMISSION } from "../entity/User";
import { validateBody } from "../middleware/validateBody";
import { validatePermissions } from "../middleware/validatePermissions";

export const DivisionRepository = AppDataSource.getRepository(Division);
export const DivisionRouter = new Router();

DivisionRouter.get("/get/:uuid", validatePermissions(PERMISSION.ADMIN), async (ctx) => {
	const div = await DivisionRepository.findOneBy({ uuid: ctx.params.uuid });
	if (div == null) throw new Error("Was not able to find a div with that uuid");
	ctx.body = Cleanse.division(div);
});

DivisionRouter.get("/get", async (ctx) => {
	ctx.body = (await DivisionRepository.find()).map(Cleanse.division);
});

const divisionCreatorValidator = RT.Record({
	name: RT.String,
});

DivisionRouter.post(
	"/create",
	validatePermissions(PERMISSION.ADMIN),
	validateBody(divisionCreatorValidator),
	async (ctx) => {
		const body = ctx.state.body as RT.Static<typeof divisionCreatorValidator>;

		const newDivision = new Division();
		newDivision.name = body.name;
		newDivision.members = [];
		DivisionRepository.save(newDivision);

		ctx.body = Cleanse.division(newDivision);
	}
);
