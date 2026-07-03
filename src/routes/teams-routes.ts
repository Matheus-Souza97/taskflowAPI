import { Router } from "express";
import { TeamsController } from "@/controller/teams-controllers";
import { ensureAuthenticated } from "@/middleware/ensure-authenticated";
import { verifyUserAuthorization } from "@/middleware/verifyUserAutorization";

const teamsRoutes = Router()
const teamsController= new TeamsController()

teamsRoutes.use(ensureAuthenticated, verifyUserAuthorization(["admin"]))
teamsRoutes.post("/", teamsController.create)
teamsRoutes.get("/", teamsController.show)
teamsRoutes.put("/:id", teamsController.update)
teamsRoutes.delete("/:id", teamsController.delete)

export { teamsRoutes }