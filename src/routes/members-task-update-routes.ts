import { Router } from "express";
import { MembersTaskUpdateController } from "@/controller/members-task-update-controller";
import { ensureAuthenticated } from "@/middleware/ensure-authenticated";

const membersTaskUpdateRoutes = Router()
const membersTaskUpdateController = new MembersTaskUpdateController()

membersTaskUpdateRoutes.use(ensureAuthenticated)

membersTaskUpdateRoutes.use("/:id", membersTaskUpdateController.update)

export { membersTaskUpdateRoutes }