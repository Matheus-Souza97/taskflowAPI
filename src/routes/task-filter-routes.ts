import { Router } from "express";
import { FilterTaskController } from "@/controller/task-filters-controller";
import { ensureAuthenticated } from "@/middleware/ensure-authenticated";

const filterTaskRoutes = Router()
const filterTaskController = new FilterTaskController()

filterTaskRoutes.use(ensureAuthenticated)

filterTaskRoutes.get("/", filterTaskController.status)

export { filterTaskRoutes}