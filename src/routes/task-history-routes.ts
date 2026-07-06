import { Router } from "express";
import { TaskHistoryController } from "@/controller/task-history-controller";
import { ensureAuthenticated } from "@/middleware/ensure-authenticated";

const taskHistoryRoutes = Router()
const taskHistoryController = new TaskHistoryController()

taskHistoryRoutes.use(ensureAuthenticated)

taskHistoryRoutes.use("/:taskId", taskHistoryController.show)

export {taskHistoryRoutes}