import { Router } from "express";
import { MembersContoller } from "@/controller/members-controller";
import { ensureAuthenticated } from "@/middleware/ensure-authenticated";
import { verifyUserAuthorization } from "@/middleware/verifyUserAutorization";

const membersRoutes = Router()
const membersController = new MembersContoller()

membersRoutes.use(ensureAuthenticated, verifyUserAuthorization(["admin"]))

membersRoutes.post("/", membersController.create)
membersRoutes.get("/:teamId", membersController.show)

export { membersRoutes }